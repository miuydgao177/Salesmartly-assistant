(function () {
  'use strict';

  function createClipboardFlowController(options) {
    const {
      getSelectedImages,
      imageMetaToBlob,
      onStateChange,
      onReset,
      onProgressChange,
      onStatus
    } = options || {};

    const state = {
      images: [],
      currentIndex: -1
    };

    function emitStateChange() {
      onStateChange?.({
        images: state.images.slice(),
        currentIndex: state.currentIndex
      });
    }

    function reset() {
      state.images = [];
      state.currentIndex = -1;
      emitStateChange();
      onReset?.(state);
      onProgressChange?.(getProgress());
    }

    function getCurrentImage() {
      const { images, currentIndex } = state;
      if (!Array.isArray(images) || currentIndex < 0 || currentIndex >= images.length) {
        return null;
      }

      return images[currentIndex];
    }

    function getProgress() {
      const { images, currentIndex } = state;
      const total = Array.isArray(images) ? images.length : 0;

      return {
        total,
        current: total > 0 && currentIndex >= 0 ? currentIndex + 1 : 0,
        hasNext: total > 0 && currentIndex >= 0 && currentIndex < total - 1
      };
    }

    async function copyImageToClipboard(imageMeta) {
      if (
        !navigator.clipboard ||
        typeof navigator.clipboard.write !== 'function' ||
        typeof ClipboardItem !== 'function'
      ) {
        return {
          ok: false,
          reason: 'unsupported'
        };
      }

      const blob = await imageMetaToBlob(imageMeta);
      if (!blob) {
        return {
          ok: false,
          reason: 'blob_unavailable'
        };
      }

      try {
        const clipboardItem = new ClipboardItem({
          [blob.type || 'image/png']: blob
        });
        await navigator.clipboard.write([clipboardItem]);
        return {
          ok: true,
          imageName: imageMeta.englishName
        };
      } catch (error) {
        return {
          ok: false,
          reason: 'write_failed'
        };
      }
    }

    async function copyCurrentImage() {
      const currentImage = getCurrentImage() || getSelectedImages()?.[0];
      if (!currentImage) {
        return {
          ok: false,
          reason: 'no_images'
        };
      }

      const copied = await copyImageToClipboard(currentImage);
      if (!copied.ok) {
        return copied;
      }

      const progress = getProgress();
      return {
        ok: true,
        imageName: currentImage.englishName,
        hasMore: progress.hasNext
      };
    }

    async function runStep() {
      const currentImage = getCurrentImage();
      if (!currentImage) {
        onProgressChange?.(getProgress());
        return {
          ok: false,
          reason: 'missing_current_image'
        };
      }

      const copied = await copyCurrentImage();
      if (!copied.ok) {
        onProgressChange?.(getProgress());
        return copied;
      }

      const progress = getProgress();
      onStatus?.(
        progress.hasNext ? `已复制 ${progress.current}/${progress.total}` : '已复制完成',
        'success'
      );
      onProgressChange?.(progress);
      return {
        ok: true,
        pasted: false
      };
    }

    async function start() {
      const selectedImages = getSelectedImages() || [];
      if (selectedImages.length === 0) {
        onStatus?.('未选图片', 'info');
        return;
      }

      state.images = selectedImages.slice();
      state.currentIndex = 0;
      emitStateChange();

      if (selectedImages.length > 1) {
        onStatus?.(`已选 ${selectedImages.length} 张`, 'info');
      }

      const result = await runStep();
      if (!result.ok) {
        onStatus?.('复制失败，请重试', 'error');
      }
    }

    async function copyNext() {
      const progress = getProgress();
      if (!progress.hasNext) {
        onStatus?.('没有下一张', 'info');
        return;
      }

      state.currentIndex += 1;
      emitStateChange();
      const result = await runStep();
      if (!result.ok) {
        onStatus?.('下一张复制失败', 'error');
      }
    }

    return {
      reset,
      getProgress,
      start,
      copyNext
    };
  }

  globalThis.SALESMARTLY_CLIPBOARD_FLOW = {
    createClipboardFlowController
  };
})();
