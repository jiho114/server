const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { User } = require('./models');
const bcrypt = require('bcryptjs'); // 비밀번호 암호화를 위한 bcrypt

const app = express();
app.use(cors({
  origin:["8seconds-react.vercel.app", "localhost:3000"]
}));
app.use(bodyParser.json());

//회원가입
app.post('/SignUp', async (req, res) => {
    const { username, password, email } = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10); // 10은 saltRounds
        const newUser = await User.create({username, password : hashedPassword , email});
        res.status(201).json(newUser);
    } catch(error) {
        res.status(400).json({ error:error.message})
    }
});

app.post('/Login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { username } });
  
      // 사용자 존재 여부 확인
      if (!user) {
        return res.status(400).json({ error: '아이디가 잘못되었습니다.' });
      }
  
      // 비밀번호 비교
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ error: '비밀번호가 잘못되었습니다.' });
      }
  
      // 로그인 성공: 유효한 사용자 정보 반환
      res.status(200).json({ message: '로그인 성공', user: { username: user.username } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
    console.log("Username:", username);
  console.log("Password:", password);
  });



const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`서버가 실행중입니다.`)
})