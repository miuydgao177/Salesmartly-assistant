/*
 * 固定图文包数据。
 * 当前为本地 MVP 占位内容，所有 message / followUp 都必须经过业务审核后才能正式使用。
 */
(function () {
  const destinationsApi = globalThis.DESTINATIONS_API;
  const imageLibraryApi = globalThis.SALESMARTLY_IMAGE_LIBRARY_API;

  function buildPlaceholderImages(destination) {
    if (!imageLibraryApi) {
      return [];
    }

    return imageLibraryApi.getImagesByDestination(destination).map((image) => ({
      ...image
    }));
  }

  function buildReviewMessage(destinationLabel) {
    return [
      `REVIEW_REQUIRED: destination-only image reply placeholder for ${destinationLabel}.`,
      'REVIEW_REQUIRED: Replace this text with approved copy before any production use.'
    ].join(' ');
  }

  function buildReviewFollowUp(destinationLabel) {
    return `REVIEW_REQUIRED: follow-up placeholder for ${destinationLabel}.`;
  }

  function buildPack(destination) {
    const destinationMeta = destinationsApi
      ? destinationsApi.getDestinationById(destination)
      : null;
    const destinationLabel = destinationMeta ? destinationMeta.nameEn : destination;
    return {
      id: `${destination}-destination`,
      destination,
      title: `${destinationMeta ? destinationMeta.nameZh : destination} | 图片库`,
      message: buildReviewMessage(destinationLabel),
      followUp: buildReviewFollowUp(destinationLabel),
      images: buildPlaceholderImages(destination),
      status: 'REVIEW_REQUIRED'
    };
  }

  const CONTENT_PACKS = [
    buildPack('beijing'),
    buildPack('chengdu'),
    buildPack('dali'),
    buildPack('fenghuang-ancient-town'),
    buildPack('furong-town'),
    buildPack('guangzhou'),
    buildPack('guilin'),
    buildPack('harbin'),
    buildPack('hangzhou'),
    buildPack('kunming'),
    buildPack('lijiang'),
    buildPack('nanjing'),
    buildPack('shanghai'),
    buildPack('suzhou'),
    buildPack('xian'),
    buildPack('shangri_la'),
    buildPack('yiwu'),
    buildPack('zhangjiajie'),
    buildPack('chongqing')
  ];

  function getPackById(packId) {
    return CONTENT_PACKS.find((pack) => pack.id === packId) || null;
  }

  function getPackBySignature(destination) {
    return CONTENT_PACKS.find((pack) => pack.destination === destination) || null;
  }

  function getPacksByDestination(destination) {
    return CONTENT_PACKS.filter((pack) => pack.destination === destination);
  }

  globalThis.CONTENT_PACKS = CONTENT_PACKS;
  globalThis.CONTENT_PACKS_API = {
    getPackById,
    getPackBySignature,
    getPacksByDestination
  };
})();
