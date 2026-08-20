export function isPublishedGuideData(data) {
  return data.publication_status === 'published' || (!data.review_status && !data.publication_status);
}
