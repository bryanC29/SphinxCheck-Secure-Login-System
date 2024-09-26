export const signup = (req, res) => {
    console.log("Signup Request");
    console.log(req.body);
    res.status(200).json({ message: "Successful request" });
}