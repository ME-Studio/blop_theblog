var sanitize        = require("express-sanitizer"),
	methodOverride  = require("method-override"), 
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    request         = require("request"),
    app             = express();

/* *****EXPRESS CONTENTS***** */  

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitize());
app.use(methodOverride("_method"));
app.use(express.static("public"));

/* *****MONGOOSE CONTENTS***** */ 

	//SCHEMA SECTOR
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	date: {type: Date, default: Date.now}
});

	//MODEL(COLLECTION) SECTOR
var Blog = mongoose.model("Blog", blogSchema);

//SAMPLE DATA
// Blog.create({
// 	title: "My laptop",
// 	image: "https://source.unsplash.com/Q7wDdmgCBFg",
// 	body:  "One of the robust laptop is ever seem"
// }, function(error, blogPost){
// 	if(!error){
// 		console.log("Blog uploaded successfully");
// 	}
// });

/* ******ROUTES****** */ 

	//GET ROUTES

		//HOMEPAGE
app.get("/", function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
	Blog.find({},function(error, allBlogPosts){
		if(!error){
			console.log("All blog posts as being retrived");
			res.render("index", {allBlogPosts: allBlogPosts});
		}
	})
});

		//CREATE NEW POST PAGE
app.get("/blogs/new", function(req,res){
	res.render("newPostForm");
});

		//SHOW POST
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(error, foundPost){
		if(!error){
			console.log("Post found succesfully");
			res.render("show", {blogPost: foundPost});
		}
	});
});

		//EDIT POST
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(error, foundPost){
		if(!error){
			console.log("Post is ready to edit");
			res.render("edit", {blogPost: foundPost});
		}
	});
});

	//POST ROUTES

		//CREATE A POST
app.post("/blogs", function(req,res){
	
	req.body.blog.body = req.sanitize(req.body.blog.body);
	
	Blog.create(req.body.blog, function(error, postCreated){
		if(!error){
			console.log("A new blog as being added succesfully");
			res.redirect("/blogs");
		}
	});
});

	//PUT ROUTES

		//UPDATE POST
app.put("/blogs/:id", function(req, res){
	
	req.body.blog.body = req.sanitize(req.body.blog.body);

	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, updatePost){
		if(!error){
			console.log("Post as being updated");
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

	//DESTROY ROUTES

		//DELETE POST
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(error){
		if(!error){
			console.log("Post as being deleted");
			res.redirect("/blogs");
		}
	});
});



/* *****SERVER CONNECTIONS***** */ 
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Blog Post server as being hosted on the PORT: 8080");
});

mongoose.connect(process.env.DATABASEURL_BLOP, {useMongoClient: true});