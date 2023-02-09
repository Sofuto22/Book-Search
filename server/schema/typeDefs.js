const {gql} = require ("apollo-server-express");

const typeDefs = gql`
type User {
    _id: ID
    username: String
    password: String
    email: String
    bookCount: Int!
}

type Book {
    bookId: String
    authors: String
    description: Int!
    title: Int!
    image: Int!
    link: Int!
}

type Auth {
    token: ID!
    user: User
}

`