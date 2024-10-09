import { DataTypes, Sequelize } from "sequelize";
export function createModel(db){
    const Idea=db.define('Idea', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        } ,       
        title:{
            type:DataTypes.STRING,
            allowNull:false,
            validate: {
                notEmpty: {
                    msg: "Title must not be empty"
                }
            }
        },
        description:{
            type:DataTypes.TEXT,
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:"Description must not be empty"
                }
            }
        },
        like:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        dislike:{
            type:DataTypes.INTEGER,
            defaultValue:0}
    });
    return Idea;
}
