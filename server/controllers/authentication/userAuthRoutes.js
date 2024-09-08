import e from "express";
import { RefreshToken, User } from "../../models/index.js"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { jwtDecode } from "jwt-decode";

dotenv.config();


//auth
const router = e.Router();

// {"username", "password"}
router.post('/login', async (req,res) => {

    const { email, password } = req.body;
    
    // Check if the user exists and the password is correct
    const user = await User.findOne({email: email});
    const passlessUser = await User.findOne({email: email}).select('-password');
    
    
    console.log(passlessUser);
    
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const cp = await user.isCorrectPassword(password);

    if(!cp){
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate a JWT with a secret key
    
    const accessToken = GenerateAccessToken(passlessUser);
    const refreshToken = jwt.sign({username: user.username}, process.env.RJWT_SECRET );
    const save = await RefreshToken.create({token: refreshToken});
  
    // Return the token to the client
    res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
});


// {"token"}
router.post('/token', async (req,res) => {

    const refreshToken = req.body.token;
    
    const refreshTokenValid = await RefreshToken.findOne({token: refreshToken});
    
    
    if(refreshToken === null) return res.status(401).json({message:"badToken"});
    if (!refreshToken) return res.status(401).json({ message: "badToken" });
    if(!refreshTokenValid) return res.status(403).json({message:"badToken"});
    const decoded = jwtDecode(refreshToken);
    const encodedUser = await User.findOne({username:decoded.username })
    jwt.verify(refreshToken, process.env.RJWT_SECRET, (err, user) => {
        if(err){
            console.error("JWT Verification Error:", err);
            return res.sendStatus(403);
        }
            
        const accessToken = GenerateAccessToken(encodedUser);
        res.json({token:accessToken}).status(200);
    })

});

// {"token"}
router.delete('/logout', async (req,res)=> {
 const deleteToken = await RefreshToken.deleteMany({token: req.body.token});


 res.sendStatus(204);

})

function GenerateAccessToken(user) {
    const payload = {user};
    const secretKey = process.env.JWT_SECRET;
    const options = { expiresIn: '15s' };

    return jwt.sign(payload, secretKey, options);
    
}


export default router;

