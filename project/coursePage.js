//---------------ON PAGE LOAD---------------------
const $root = $('#root');
const $top = $('#top');
const classNumber = localStorage.getItem('class');
const auth = localStorage.getItem('jwt');
const user = localStorage.getItem('name');
const image = localStorage.getItem('image');

$(document).ready(async function () {
    // loads the post box and also what class it is
    document.title = `COMP ${classNumber}`;
    let x = `<h1 style="margin-top: 25px" class="is-family-primary" align="center"><strong>COMP ${classNumber}</strong></h1>
        <div class="box post" style="background-color: #b8def9">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <textarea id="textBox" class="textarea" placeholder="Type post here"></textarea>
                        </p>
                    </div>
                    <div class="container has-text-right">
                        <button id="post" class="button is-dark"> Post </button>
                    </div>
                </div>
            </article>
        </div>`;
    $('#textBox').val(null);
    $top.append(x);
    $top.append(`<br>`);

    // loads all the posts
    let posts = await getPosts();
    posts = posts.data.result;

    let IDs = [];
    for (let prop in posts) {
        if (Object.prototype.hasOwnProperty.call(posts, prop)) {
            IDs.push(prop);
        }
    }

    for (let i = IDs.length-1; i >= 0; i--) {
        let posts = await getPostsId(IDs[i]);
        let post = posts.data.result[0].post;
        let author = posts.data.result[0].author;
        let id = post + author.replace(/\s/g, "");
        let pic = posts.data.result[0].pic;

        if (user == author) {
            post = `<div id="${id}" class="box post" style="background-color: #e7f4fd">
            <article class="media">
                <div class="media-left">
                    <figure class="image is-64x64">
                        <img src="${image}" alt="Image">
                    </figure>
                </div>
                <div class="media-content">
                    <div class="content">
                        <p><strong>${author}</strong><br>${post}</p>
                    </div>
                    <nav class="level is-mobile">
                        <div class="level-left">
                        </div>
                        <div class="level-right">
                            <button id="delete" class="button is-danger mine" name="">Delete</button>
                        </div>
                    </nav>
                </div>
            </article>`
        } else {
            post = `<div id="${id}" class="box post" style="background-color: #e7f4fd">
            <article class="media">
                <div class="media-left">
                    <figure class="image is-64x64">
                        <img src="${pic}" alt="Image">
                    </figure>
                </div>
            <div class="media-content">
                <div class="content">
                    <p>
                        <strong>${author}</strong>
                        <br> ${post}
                    </p>
                </div>
                <nav class="level is-mobile">
            
                    <div class="level-right">
                    </div>
                </nav>
            </div>`;
        }
        $root.append(post);
    }

    $(document).on('click', "#post", createPost);
    $(document).on('click', "#delete", deletePost);
    $(document).on("click", "#logout", handleLogout);

});

const getPosts = async function () {
    const auth = localStorage.getItem('jwt');
    return await privateRoot.get(`/${classNumber}`, {
        headers: {
            Authorization: `Bearer ${auth}`
        }
    });
}

const getPostsId = async function (id) {
    const auth = localStorage.getItem('jwt');
    return await privateRoot.get(`/${classNumber}/${id}`, {
        headers: {
            Authorization: `Bearer ${auth}`
        }
    });
}

const createPost = async function () {
    let text = $('#textBox').val();
    let author = localStorage.getItem('name');
    let id = text + author.replace(/\s/g, "");

    let post = await axios.post(`http://localhost:3000/private/${classNumber}/${id}/`, {
            data: {
                post: text,
                author: author,
                pic: image
            },
            type: "merge"
        }, {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        }, )
        .then(res => console.log(res))
        .catch(err => console.log(err));

    post = `<div id="${id}" class="box post" style="background-color: #e7f4fd">
    <article class="media">
        <div class="media-left">
            <figure class="image is-64x64">
                <img src="${image}" alt="Image">
            </figure>
        </div>
        <div class="media-content">
            <div class="content">
                <p><strong>${author}</strong><br>${text}</p>
            </div>
            <nav class="level is-mobile">
                <div class="level-left">
                </div>
                <div class="level-right">
                    <button id="delete" class="button is-danger mine" name="">Delete</button>
                </div>
            </nav>
        </div>
    </article>`
    $root.prepend(post);
    $('#textBox').val(null);
}


const deletePost = async function () {
    let id = $(event.target).parent().parent().parent().parent().parent().attr("id");
    axios.delete(`http://localhost:3000/private/${classNumber}/${id}/`, {
        headers: {
            Authorization: `Bearer ${auth}`
        }
    });
    $(`#${id}`).remove();
}
// ---------------BACK END-----------------------

const pubRoot = new axios.create({
    baseURL: "http://localhost:3000/public"
});

const userRoot = new axios.create({
    baseURL: "http://localhost:3000/user"
});

const accountRoot = new axios.create({
    baseURL: "http://localhost:3000/account"
});

const privateRoot = new axios.create({
    baseURL: "http://localhost:3000/private"
});

const handleLogout = function (event) {
    localStorage.clear();
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        window.location.replace('login.html');
    });
}

function onLoad() {
    gapi.load('auth2', function () {
        gapi.auth2.init();
    })
}