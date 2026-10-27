export async function load(url, context, nextLoad) {
  if (/\.(jpg|jpeg|png|svg|webp|gif)$/i.test(url)) {
    return {
      format: "module",
      shortCircuit: true,
      source: 'export default "/assets/mock-image.jpg";',
    };
  }
  return nextLoad(url, context);
}
