const express =require('express');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const app =express();

app.use(express.json())

const AdminSecret='eRtXyuwQio';
const StudentSecret='SecTyens';

const teacherSchema=new mongoose.Schema({
    username:String,
    password:String,
})
const studentSchema=new mongoose.Schema({
    studentname:String,
    password:String,
    purchasedCourses:[{type:mongoose.Types.ObjectId,ref:'Course'}]

})
const courseSchema=new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    imageLink:String,
})
const Teacher = mongoose.model('Teacher', teacherSchema);
const Student=mongoose.model('Student',studentSchema);
const Course=mongoose.model('Course',courseSchema);

const teacherjwtauth=(req,res,next)=>{
const authenticateheader=req.headers.authorization;
if(!authenticateheader){
res.sendStatus(401)
}
else{
    const token=authenticateheader.split(' ')[1];
    jwt.verify(token,AdminSecret,(err,user)=>{
        if(err){
            res.sendStatus(403)
        }
            req.user=user;
            next();
    });
}
};
const studentjwtauth=(req,res,next)=>{
const authheader=req.header.authorization
if(authheader){
    const token=autheheader.split(' ')[1];
    jwt.verify(token,StudentSecret,(err,student)=>{
        if(err){
            res.sendStatus(403)
        }
        req.student=student;
        next()

    })
}else{
    res.sendStatus(401)
}
};
mongoose.connect('mongodb+srv://aminarahman01:N1sh4M0ng0@cluster0.utbunmm.mongodb.net/course_selling_website');

app.post('/teacher/signup',async(req,res)=>{
    const username=req.body;
    const password=req.body;
    //alternative const {username,password}=req.body
    try{
    const teacher=await Teacher.findOne({username})
    if(teacher){
        res.status(403).json({message:'Teacher Already Exists'});
    }
    else{
        const obj={
            username:username,
            password:password,
        }
        const newTeacher=new Teacher(obj);
        await newTeacher.save();
        const token = jwt.sign({
           username,
           role:'admin', 
        },AdminSecret,
        {expiresIn:'5h'});
        res.json({message:'Teacher Account Created Succesfully',token})
    }
    }
    catch(error){
        res.status(500).json({message:'Error processing request'});
    }

});
app.post('/teacher/login',async(req,res)=>{
    const {username,password}=req.body;
    const teacher=await Teacher.findone({username,password});
    if(teacher){
        const token=jwt.sign({username,role:'admin'},AdminSecret,{expiresIn:'5h'});
        res.json({message:'loged in succesfuly as teacher'},token);
    }
    else{
        res.status(403).json({message:'Invalid username or password'});
    }
});
app.post('/student/signup',async(req,res)=>{
    const {username,password}=req.body;
    try{
        const student=await Student.findOne({username});
        if(student){
            res.status(403).json({message:'student username already exists'});
            const obj={
                username:username,
                password:password,

            }
            const newStudent=new Student(obj);
            await newStudent.save();
            const token=jwt.sign({
                username,
                role:'student',
            },StudentSecret,{encoding:'5h'});
         res.json({message:"Student Account created Succesfully"},token)
        }
        else{
            res.status(403).json({ message: 'Invalid username or password' });

        }
    }
    catch(error){
        res.status(403).json({message:'Invalid username or password'});
    }
});
app.post('/student/login',async(req,res)=>{
    const {username,password}=req.body;
    const student=await Student.findone({username,password});
    if(student){
        const token=jwt.sign({username,role:'student'},StudentSecret,{expiresIn:'5h'});
        res.json({message:'loged in succesfuly as student'},token);
    }
    else{
        res.status(403).json({message:'Invalid username or password'});
    }
});
app.listen(3000, () => console.log('Server running on port 3000'));