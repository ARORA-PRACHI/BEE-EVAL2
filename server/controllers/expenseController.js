const expenseModel = require('../models/expenseModel');
const userModel = require('../models/userModel');
const { error, success } = require('../utils/handler');

const createExpense =async (req,res)=>{
    try {
        const {amount , category , date , usersid} = req.body;
        if(!amount || !category || !date || !usersid)
        {
            return res.send(error(401,"All Details Are Required"));
        }
        const newExpense = await expenseModel.create(req.body);
        const userToUse = await userModel.findById(usersid).populate('expense_id');
        // console.log(userToUse)
        userToUse.expense_id.push(newExpense._id);
        newExpense.save();
        userToUse.save();
        return res.send(success(200,newExpense))
        
    } catch (e) {
        return res.send(error(401,e.message))
    }
}

const deleteExpense = async (req,res)=>{
    try {
        const {expenseId , userId} = req.body;
        

        const expense = await expenseModel.findById(expenseId)
        const user = await userModel.findById(userId);
        ///
        // console.log(typeof userId)
        if(!expense || !user)
        {
            return res.send(error(401,`Invalid ${!expense } + ${!user}`))
        }
        
        if(user.expense_id.includes(expenseId))
        {
            
            await expenseModel.findByIdAndDelete(expenseId);
            // console.log(user.expenseid);
            const index =  user.expense_id.indexOf(expenseId);
            // console.log("here " + index);
            user.expense_id.splice(index,1);
        }
        await user.save();
       return res.send(success(201,{respo : 'Successfully Deleted' , user}));
    } catch (e) {
       return res.send(error(401,e.message))
    }
}

const getAllExpenses = async (req,res)=>{
    try {
        
        const {userId} = req.body;
        const user = await userModel.findById(userId).populate('expense_id');
        
        return res.send(success(200,user.expense_id.sort()));
    } catch (e) {
        return res.send(error(401,e.message))   
    }
}

const getCategoryExpense = async (req,res)=>{
    try {
        
    } catch (e) {
        return res.send(error(401,e.message))
    }
}


module.exports = {
    createExpense ,
    deleteExpense , 
    getCategoryExpense ,
    getAllExpenses
    
}