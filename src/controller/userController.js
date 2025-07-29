const { users } = require("../database/connection");
const bcrypt=require('bcrypt')

const registerUser = async (req, res) => {
  const { email, password,schoolDomain } = req.body;

  if (!email || !password ||!schoolDomain ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const existingUser = await users.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "Users already exists" });
  }

  await users.create({
    email,
    password: bcrypt.hashSync(password, 12),
    schoolDomain

  });

  return res.status(201).json({
    message: "User registered successfully",
  });
};


const fetchUser = async(req,res)=>{
  const data = await users.findAll()
 return res.status(200).json({
    message:'School fetched successfully',
    data
  })
}

const deleteUser = async (req,res) =>{
  const {id}= req.params
  await users.destroy({where:{
    id
  }})

  return res.status(200).json({
    message:"user deleted successfully"
  })
}

module.exports={deleteUser,fetchUser,registerUser}