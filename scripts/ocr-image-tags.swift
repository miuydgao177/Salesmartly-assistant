import Foundation
import Vision
import AppKit

struct Record: Encodable {
  let destinationZh: String
  let destinationEn: String
  let file: String
  let detectedText: [String]
  let suggestedTags: [String]
}

let destinationEnglishMap: [String: String] = [
  "北京": "beijing",
  "成都": "chengdu",
  "桂林": "guilin",
  "广州": "guangzhou",
  "大理": "dali",
  "哈尔滨": "harbin",
  "昆明": "kunming",
  "杭州": "hangzhou",
  "丽江": "lijiang",
  "张家界": "zhangjiajie",
  "南京": "nanjing",
  "上海": "shanghai",
  "苏州": "suzhou",
  "西安": "xian",
  "香格里拉": "shangri_la",
  "义乌": "yiwu",
  "重庆": "chongqing",
  "芙蓉镇": "furong-town",
  "凤凰古城": "fenghuang-ancient-town"
]

func normalizeWhitespace(_ text: String) -> String {
  return text.replacingOccurrences(
    of: "\\s+",
    with: " ",
    options: .regularExpression
  ).trimmingCharacters(in: .whitespacesAndNewlines)
}

func sanitizeTag(_ text: String) -> String {
  let trimmed = normalizeWhitespace(text).lowercased()
  let replaced = trimmed.replacingOccurrences(
    of: "[^\\p{Han}a-z0-9]+",
    with: "-",
    options: .regularExpression
  )
  return replaced.trimmingCharacters(in: CharacterSet(charactersIn: "-"))
}

func extractChinesePhrases(_ text: String) -> [String] {
  let pattern = "[\\p{Han}]{2,}"
  guard let regex = try? NSRegularExpression(pattern: pattern) else {
    return []
  }

  let nsText = text as NSString
  let matches = regex.matches(in: text, range: NSRange(location: 0, length: nsText.length))
  return matches.compactMap { match in
    let phrase = nsText.substring(with: match.range)
    return normalizeWhitespace(phrase)
  }
}

func extractEnglishPhrases(_ text: String) -> [String] {
  let pattern = "[A-Za-z][A-Za-z0-9&'’\\- ]{1,60}"
  guard let regex = try? NSRegularExpression(pattern: pattern) else {
    return []
  }

  let nsText = text as NSString
  let matches = regex.matches(in: text, range: NSRange(location: 0, length: nsText.length))
  return matches.compactMap { match in
    let phrase = normalizeWhitespace(nsText.substring(with: match.range))
    if phrase.count < 2 {
      return nil
    }
    return phrase
  }
}

func orderedUnique(_ values: [String]) -> [String] {
  var seen = Set<String>()
  var result: [String] = []

  for value in values {
    let normalized = normalizeWhitespace(value)
    if normalized.isEmpty || seen.contains(normalized) {
      continue
    }
    seen.insert(normalized)
    result.append(normalized)
  }

  return result
}

func detectTextLines(imageURL: URL) -> [String] {
  guard let image = NSImage(contentsOf: imageURL) else {
    return []
  }

  var imageRect = NSRect(origin: .zero, size: image.size)
  guard let cgImage = image.cgImage(forProposedRect: &imageRect, context: nil, hints: nil) else {
    return []
  }

  let request = VNRecognizeTextRequest()
  request.recognitionLevel = .accurate
  request.usesLanguageCorrection = true
  request.recognitionLanguages = ["zh-Hans", "en-US"]

  let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

  do {
    try handler.perform([request])
  } catch {
    return []
  }

  guard let observations = request.results else {
    return []
  }

  let lines = observations.compactMap { observation in
    observation.topCandidates(1).first?.string
  }

  return orderedUnique(lines.map(normalizeWhitespace))
}

func buildTags(destinationZh: String, destinationEn: String, detectedLines: [String]) -> [String] {
  var tags: [String] = []
  tags.append(destinationZh)
  tags.append(destinationEn)

  for line in detectedLines {
    tags.append(contentsOf: extractChinesePhrases(line))
    tags.append(contentsOf: extractEnglishPhrases(line))
  }

  let normalized = orderedUnique(tags)
  let sanitized = orderedUnique(normalized.map(sanitizeTag).filter { !$0.isEmpty })
  return sanitized
}

func shouldInclude(_ url: URL) -> Bool {
  let ext = url.pathExtension.lowercased()
  return ["png", "jpg", "jpeg", "webp", "heic"].contains(ext)
}

func scan(rootURL: URL) -> [Record] {
  guard let enumerator = FileManager.default.enumerator(
    at: rootURL,
    includingPropertiesForKeys: [.isRegularFileKey],
    options: [.skipsHiddenFiles]
  ) else {
    return []
  }

  var records: [Record] = []

  for case let fileURL as URL in enumerator {
    guard shouldInclude(fileURL) else {
      continue
    }

    let destinationZh = fileURL.deletingLastPathComponent().lastPathComponent
    let destinationEn = destinationEnglishMap[destinationZh] ?? sanitizeTag(destinationZh)
    let detectedLines = detectTextLines(imageURL: fileURL)
    let tags = buildTags(
      destinationZh: destinationZh,
      destinationEn: destinationEn,
      detectedLines: detectedLines
    )

    records.append(
      Record(
        destinationZh: destinationZh,
        destinationEn: destinationEn,
        file: fileURL.path,
        detectedText: detectedLines,
        suggestedTags: tags
      )
    )
  }

  return records.sorted { $0.file < $1.file }
}

let arguments = CommandLine.arguments
guard arguments.count >= 2 else {
  fputs("Usage: swift scripts/ocr-image-tags.swift <image-root-directory>\n", stderr)
  exit(1)
}

let rootURL = URL(fileURLWithPath: arguments[1])
let records = scan(rootURL: rootURL)
let encoder = JSONEncoder()
encoder.outputFormatting = [.prettyPrinted, .withoutEscapingSlashes]

do {
  let data = try encoder.encode(records)
  FileHandle.standardOutput.write(data)
} catch {
  fputs("Failed to encode OCR results.\n", stderr)
  exit(1)
}
