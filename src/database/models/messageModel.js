module.exports = (sequelize,DataTypes) => {
    const Message = sequelize.define('message',{
        id:{
            primaryKey:true,
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4
        },
        firstName:{
            type:DataTypes.STRING,
            allowNull:false,
        
        },
        lastName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        emailAddress:{
            type:DataTypes.STRING,
            unique:true
        },
        phoneNumber:{
          type:DataTypes.STRING,
          allowNull:false
        },
     
        message:{
          type:DataTypes.TEXT,
          allowNull:false
        },
        schoolDomain:{
          type:DataTypes.STRING
        }
    })
    return Message
}

