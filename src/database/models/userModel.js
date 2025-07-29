module.exports = (sequelize,DataTypes) => {
    const User = sequelize.define('user',{
        id:{
            primaryKey:true,
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
        },
      
        role: {
            type: DataTypes.STRING,
            defaultValue: 'admin',
            allowNull: false,
        
        },
        schoolDomain:{
          type:DataTypes.STRING,
          allowNull:false,
          unique:true
        }
    
    })
    return User
}

