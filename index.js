const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const models = require('./models');
const bcrypt = require('bcryptjs'); // 비밀번호 암호화를 위한 bcrypt

const app = express();
app.use(cors({
  origin:["https://8secondes-react.vercel.app", "http://localhost:3000"]
}));
app.use(bodyParser.json());

//회원가입
app.post("/users", (req, res) =>{
    const { username, password, email } = req.body;
   
    if(!username|| !password|| !email){
      res.send('모든 필드를 입력해주세요')
   }
    models.User.create({
      username,
      password,
      email
   })
   .then((result)=>{
      console.log('회원가입성공:', result);
      res.send({result,})
   })
   .catch((error)=>{
      console.error(error);
      res.status(400).send('회원가입실패')
   })
});

app.post('/users/login', (req, res) => {
    const { username, password } = req.body;

    models.User.findOne({
      where:{
        username:username
      }
   })
   .then((result)=>{
     
      console.log("result :" ,result)
      if(result.username == username && result.password == password){
         console.log('로그인 정보 성공');
         const user = {
            username: username
         }
         res.send({
            user: result.username,

         })
      }else{
         console.log("로그인 실패");
         res.send({
            user: 'False'
         })
      }
   })
   .catch((error)=>{
      console.error(error);
      res.send('유저 정보 에러 발생' + error)
   })   
  
   
  });



const PORT = "8080";
app.listen(PORT, ()=>{
    console.log(`서버가 실행중입니다.`);
    models.sequelize   
    .sync()
    .then(() => {
       console.log('✓ DB 연결 성공');
    })
    .catch(function (err) {
       console.error(err);
       console.log('✗ DB 연결 에러');
          //에러발생시 서버프로세스 종료
       process.exit();
 });
})