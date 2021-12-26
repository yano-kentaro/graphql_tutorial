// expressモジュールの読み込み
const express = require("express");
// express-graphqlモジュールの読み込み
const { graphqlHTTP } = require("express-graphql");
// mongooseモジュールの読み込み
const mongoose = require("mongoose");
const schema = require("./schema/schema");

// appオブジェクトにexpressの変数やメソッドを格納
const app = express();

// MongoDBに接続
// 'mongodb+srv://{user_name}:{password}@cluster0.rph99.mongodb.net/{db_name}?retryWrites=true&w=majority'
mongoose.connect('mongodb+srv://admin:ynkn1995@cluster0.rph99.mongodb.net/test?retryWrites=true&w=majority');
// 接続確認
mongoose.connection.once('open', () => {
	console.log('MongoDB connected!');
});

// 一つのエンドポイントでデータのやりとりをするためのミドルウェアを作成
// app.use(パス, ハンドラー関数);
// ハンドラー関数はschemaを使用してデータのやり取りを行う
app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: true
}));

// サーバー起動メソッド
app.listen(4000, () => {
	console.log('listening port 4000.');
});
