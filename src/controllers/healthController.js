function getHealth(req, res) {
  return res.status(200).json({
    status: "Neighbo backend running"
  });
}

export { getHealth };

