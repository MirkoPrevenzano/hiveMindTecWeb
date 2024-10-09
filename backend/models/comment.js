import { DataTypes, ValidationError } from "sequelize";

export function createModel(db)
{
    const Comment=db.define('Comment',  {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            
        },

        description:{
                type: DataTypes.STRING,
                allowNull:false,
                validate: {
                        notEmpty: {
                            msg: "Description must not be empty"
                        }
                },
        },

        time:{
            type: DataTypes.DATE,
            defaultValue:DataTypes.NOW,
            validate: {
                notEmpty: {
                    msg: "Time must not be empty"
                }
            },
        },
        

        like:{ 
            type: DataTypes.INTEGER,
            defaultValue:0
        },
       
        date:{
            type: DataTypes.DATE,
            defaultValue:DataTypes.NOW,
            validate: {
                notEmpty: {
                    msg: "Date must not be empty"
                }
            }
        } 
    });
    return Comment;
}