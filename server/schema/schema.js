// graphqlモジュールの読み込み
const graphql = require("graphql");

// Movie Collectionの読み込み
const Movie = require("../models/movie")
// Director Collectionの読み込み
const Director = require("../models/director")


// データをどのように扱うか、データ間のリレーションを定義
// GraphQLObjectType: データの雛形、インスタンスを生成出来る
// GraphQLID, GraphQLString: 型
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList } = graphql;

// MovieTypeを作成
const MovieType = new GraphQLObjectType({
	name: "movie",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		director: {
			type: DirectorType,
			resolve(parent, args) {
				return Director.findById(parent.directorId)
			}
		}
	})
});

// DirectorTypeを作成
const DirectorType = new GraphQLObjectType({
	name: "director",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		movies: {
			type: new GraphQLList(MovieType),
			resolve(parent, args) {
				return Movie.find({ directorId: parent.id })
			}
		}
	})
});

// 外部からMovieTypeを取得出来るようにRootQueryを設定
// args: 検索時に使用するパラメーター
// resolve: 返り値の設定
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		movie: {
			type: MovieType,
			args: { id: { type: GraphQLID } },
			resolve(parents, args) {
				return Movie.findById(args.id)
			}
		},
		director: {
			type: DirectorType,
			args: { id: { type: GraphQLID } },
			resolve(parents, args) {
				return Director.findById(args.id)
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addMovie: {
			type: MovieType,
			args: {
				name: { type: GraphQLString },
				genre: { type: GraphQLString },
				directorId: { type: GraphQLID }
			},
			resolve(parents, args) {
				let movie = new Movie({
					name: args.name,
					genre: args.genre,
					directorId: args.directorId
				});
				return movie.save();
			}
		},
		addDirector: {
			type: DirectorType,
			args: {
				name: { type: GraphQLString },
				age: { type: GraphQLInt },
			},
			resolve(parents, args) {
				let director = new Director({
					name: args.name,
					age: args.age
				});
				return director.save();
			}
		},
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});