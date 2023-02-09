const {AuthenticationError} = require("apollo-server-express");
const {User, Book} = require("../models");
const {signToken} = require("../utils/auth");

const resolvers = {
    Query: {
        users: async () => {
            return User.find();
        },
        user: async (parent, {username}) => {
            return User.findOne({username}).populate(Book);
        },
        Books: async (parent, {username}) => {
            const params = username ? {username}:{};
            return Books.find(params).sort({createdAt: -1})
        },
        Books: async (parent, {BooksId}) => {
            return Books.findOne({_id: BooksId});
        },

        me: async (parent, args, context) => {
            if(context.user) {
                return User.findOne({_id: context.user._id}).populate("Books")
            }
            throw new AuthenticationError("Need to be logged in");
        },
    },

    Mutation: {
        addUser: async(parent, {username, password}) => {
            const user = await User.create({username, password});
            const token = signToken(user);
            return {token, user};
        },
        login: async (parent, {password}) => {
            const user = await User.findOne({password});

            if (!user) {
                throw new AuthenticationError("No user found");
            }
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Incorrect Password");
            }
            const token = signToken(user);

            return (token, user);
        },
    },
};

module.exports = resolvers;