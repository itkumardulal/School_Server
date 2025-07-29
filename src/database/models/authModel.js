module.exports = (sequelize,DataTypes) => {
    const Admin = sequelize.define('admin',{
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
            defaultValue: 'superAdmin',
            allowNull: false,
        
        }
    })
    return Admin
}

