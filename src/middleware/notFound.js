function notFound(req, res) {
  return res.status(404).json({ error: "Not Found" });
}

export default notFound;

