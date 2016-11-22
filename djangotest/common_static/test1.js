console.log("test1文件开始加载");
var laoliu_data={
    "class1": "foo",
    "title": "Random Title",
    "items": [
        { "name": "foo", "tags": {"bar": "baz", "qux": "quux"} },
        { "name": "Lorem", "tags": {
            "ipsum": "dolor",
            "sit": "amet",
            "consectetur": "adipiscing",
            "elit": "Sed",
            "hendrerit": "ullamcorper",
            "ante": "id",
            "vestibulum": "Lorem",
            "ipsum": "dolor",
            "sit": "amet"
        }
        }
    ]
};
var QWeb = new QWeb2.Engine();
//QWeb.debug = true;
QWeb.add_template('static/myQweb.xml');

$(document).ready(function () {
	console.log(123);
    setTimeout(function(){
        result=QWeb.render('example_template',laoliu_data);
        $('#myQweb').append(result);
    },100)
});