import express from "express";
import mysql from "mysql"

const app=express();

// json형식 사용하기 위한 설정
app.use(express.json())

// db접속 정보
const db=mysql.createConnection({
    host:"127.0.0.1",
    user:"admin",
    password:"1234",
    port:"3306",
    database:"db_sample2"
});

db.connect(err=>{
    console.log("db 연결 성공!");
    console.log("err",err)
})

app.listen(8000,()=>{
    console.log("8000번 서버 접속");
})

// 기본 주소 요청
// localhost:8000/

app.get("/",()=>{
    console.log("기본 주소 요청");
})

app.get("/hello",()=>{
    console.log("hello 주소 요청");
})

// query string
app.get("/qs",(req)=>{
    console.log(req.query.p1);
})

// post 요청
app.post("/hello",()=>{
    console.log("/hello post 요청");
})

// post-req post요청
app.post("/post-req",(req)=>{
    console.log(req.body);
    console.log(req.body.name);
    // destructuring 변수처리
    const { name,age}=req.body;
    console.log(`name:${name}, age:${age}`);
})

// db 전송
app.post("/save",(req)=>{
    const {name,capital, population}=req.body;
    // "`" backtick
    console.log(`name:${name},capital:${capital},population:${population}`);
    // db 쿼리문 설정
    const sql="insert into nations2(name,capital, population) values(?,?,?)";
    // db 데이터 전송
    db.query(sql,[name,capital, population],(err,results,field)=>{
        console.log("err", err);
        console.log("results",results);
        console.log("population",population)
    })
})

// db목록 표시
app.get("/list",(req,res)=>{
    // 쿼리문 설정
    const sql="select * from nations2";
    db.query(sql,(err,results,field)=>{
        console.log("err",err);
        console.log("results",results);
        console.log("field",field);
        res.json(results);
    })
})

// 상세 목록 조회
app.get("/:id",(req,res)=>{
    console.log(req.params.id)
    const id=req.params.id;
    // 쿼리문 작성
    const sql="select * from nations2 where id=?"
    db.query(sql,[id],(err,results,field)=>{
        console.log("err",err);
        console.log("results",results);
        if(results.length===0){
            // 조회 자료 없음
            console.log("조회데이터 없음")
            res.status(404).send("조회 자료가 없습니다.")
        } else{
            res.status(200).json(results);
        }
        
    })
})

// 목록 update
app.put("/:id",(req,res)=>{
    const {id,name,capital,population}=req.body;
    console.log(`id=${id}, name=${name}, capital=${capital}, population=${population}`)
    const sql="update nations2 set population=? where id=?";
    db.query(sql,[population, id],(err,results,population)=>{
        console.log("err",err);
        console.log("results",results);
    })

})

// 자료 삭제
app.delete("/:id",(req,res)=>{
    const id=req.params.id;
    const sql="delete from nations2 where id=? "
    db.query(sql,[id],(err,results,fields)=>{
        console.log("err",err)
    })
})