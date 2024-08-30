import e from "express";
import { RefreshToken, User } from "../../models/index.js"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


//auth
const router = e.Router();
router.post('/login', async (req,res) => {

    const { username, password } = req.body;
    
    // Check if the user exists and the password is correct
    const user = await User.findOne({username: username});
    
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const cp = await user.isCorrectPassword(password);

    if(!cp){
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Generate a JWT with a secret key
    const accessToken = GenerateAccessToken(user.username);
    const refreshToken = jwt.sign({username: user.username}, process.env.RJWT_SECRET );
    const save = await RefreshToken.create({token: refreshToken});
  
    // Return the token to the client
    res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
});

router.post('/token', async (req,res) => {

    const refreshToken = req.body.token;
    
    const refreshTokenValid = await RefreshToken.findOne({token: refreshToken});
    console.log(refreshTokenValid);
    
    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokenValid) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.RJWT_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = GenerateAccessToken({username: user.name});
        res.json(accessToken);
    })

});
router.delete('/logout', async (req,res)=> {
 const deleteToken = await RefreshToken.deleteMany({token: req.body.token});


 res.sendStatus(204);

})

function GenerateAccessToken(user) {
    const payload = {username: user};
    const secretKey = process.env.JWT_SECRET;
    const options = { expiresIn: '15m' };

    return jwt.sign(payload, secretKey, options);
    
}


export default router;

