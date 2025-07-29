const { messages } = require("../database/connection")

const addMessage = async (req,res)=>{
  const {firstName,lastName,emailAddress,message,phoneNumber,schoolDomain} = req.body
  if(!firstName || !lastName || !emailAddress  || !message || !phoneNumber) {
    return res.status (400).json({
      message:'please provide the details of the all required field'
    })
  }
  await messages.create({
    firstName,
    lastName,
    emailAddress,
    message,
    phoneNumber,
    schoolDomain
  })
return res.status(201).json({
  message:"message added successfully"
})
}

const fetchMessage = async (req,res) =>{
   const role = req.userRole;
  const user = req.user;

  if (role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins are allowed to access messages." });
  }

  if (!user || !user.schoolDomain) {
    return res
      .status(403)
      .json({ message: "Missing school domain for this admin." });
  }
  const data = await messages.findAll({
    where: { schoolDomain: user.schoolDomain },
    order: [["createdAt", "DESC"]],
  });
 return  res.status(200).json({
    message:"message fetched successfully",
    data
  })
}

const deleteMessage = async (req,res)=>{
  const {id}=req.params
  await messages.destroy({
    where:{
      id
    }
  })
  return res.status(200).json({
    message:"message deleted successfully"
  })
}

module.exports  = {addMessage,deleteMessage,fetchMessage}