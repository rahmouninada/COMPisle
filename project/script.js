//--------------------RENDER HTML------------------

const renderUserClass = function (c) {
    let professor = getProfessor(c);
    let image = getImage(c);
  
    let course = ['<div id="',
        c,
        '"class="box post" style="background-color: #e7f4fd">',
        '<article class="media">',
        ` <div class="media-left">
        <figure >
            <img src="${image}" alt="Image" class="profPic">
        </figure>
    </div>`,
        '<div class="media-content">',
        '<div class="content">',
        '<p><strong>',
        'COMP ', c,
        '</strong><br>',
        professor,
        '</p>',
        '</strong>',
        '</p>',
        '</div>',
        '</div>',
        '<button id="go" class="button is-primary" name="',
        c,
        '">Go</button>',
        '<div class="media-right">',
        '<button id="remove" class="button is-danger" name="',
        c,
        '">Remove</button>',
        '</div>',
        '</article>',
        '</div>'
    ].join('');

    return course;
}

const renderClass = function (c) {
    let course = ['<div id="',
        "" + c.number + "",
        '"class="box post" style="background-color: #e7f4fd">',
        '<article class="media">',
        ` <div class="media-left">
        <figure>
            <img src="${c.image}" class="profPic" alt="Image">
        </figure>
    </div>`,
        '<div class="media-content">',
        '<div class="content">',
        '<p><strong>',
        'COMP ', c.number,
        '</strong><br>',
        c.professor,
        '</p>',
        '</div>',
        '</div>',
        '<div class="media-right">',
        '<button id="join" class="button is-info" name="',
        c.number,
        '">Join</button>',
        '</div>',
        '</article>',
        '</div>'
    ].join('');

    return course;
}

//---------------LOAD HOME PAGE-------------------

const loadPublicHome = async function () {
    let menu = document.getElementById("menu");
    $(menu).replaceWith('<a style="margin-right: 12px" href="login.html" class="navbar-item">Login</a>');
    // get classes
    let classes = await getAllCourses();

    let courses = classes.data.result;


    // generate and load classes using renderClass
    let rendered = [];

    courses.forEach(c => {
        rendered.push(renderClass(c))
    });
    $('.display').append(rendered);

    // add event handler for joining a class
    $(document).on("click", "#join", handleJoin);
    // $(document).on("click", "#login", login);
}

const loadUserHome = async function () {
    // generate and load other classes
    $('.display').append('<div class="myClasses"></div>');
    $('.myClasses').append('<h1 class="is-family-primary" align="center"><strong>My Classes</strong></h1>');

    $('.display').append('<div style="margin-top: 15px" class="moreClasses"></div>');
    $('.moreClasses').append('<h1 class="is-family-primary" align="center"><strong>More Classes</strong></h1>');

    let myClasses = await getMyCourses();

    if (myClasses !== undefined) {

        let courses = myClasses.data.result;

        // generate and load classes using renderClass
        let rendered = [];

        courses.forEach(c => {
            rendered.push(renderUserClass(c))
        });
        $('.myClasses').append(rendered);

        // get classes
        let classes = await getAllCourses();

        let otherCourses = classes.data.result;


        // generate and load classes using renderClass
        let otherRendered = [];

        otherCourses.forEach(c => {
            if (!courses.includes("" + c.number + "")) {
                otherRendered.push(renderClass(c))
            }
        });
        $('.moreClasses').append(otherRendered);

    } else {
        // get classes
        let classes = await getAllCourses();

        let courses = classes.data.result;


        // generate and load classes using renderClass
        let rendered = [];

        courses.forEach(c => {
            rendered.push(renderClass(c))
        });
        $('.moreClasses').append(rendered);
    }

    // add event handler for joining a class
    $(document).on("click", "#join", handleJoin);
    $(document).on("click", "#remove", handleRemove);
    $(document).on("click", "#logout", handleLogout);
    $(document).on("click", "#go", handleGo);
}

const setupSearchBox = async function () {
    //Adding listener to search button
    var myEl = document.getElementById('searchButton');

    myEl.addEventListener('click', async function () {
        selection = document.getElementById('mainSearchBar').value
        let myClasses = await getMyCourses();
        let myCourses = myClasses.data.result;
        console.log(myCourses);
        selectionNum = selection.slice(-3);
        let inSelectedClass = false;

        //Checking if the user has joined selected class
        for (i = 0; i < myCourses.length; i++) {
            if (selectionNum === myCourses[i]) {
                inSelectedClass = true;
            }
        }

        //Trying to navigate to seleected class
        if (inSelectedClass) {
            localStorage.setItem('class', selectionNum);
            window.location.href = "coursePage.html";
            //FINDING PAGE TO OPEN
        } else {

            $(".modal").addClass("is-active");
            $(".modal-background").click(backgroundHandler);
            $(".modal-close").click(backgroundHandler)
        }

    }, false);
}

function backgroundHandler(event) {
    $(".modal").removeClass("is-active");
}

const getAllCourses = async function () {
    return await pubRoot.get('/authors');
}

const getMyCourses = async function () {
    const id = localStorage.getItem('id');
    const auth = localStorage.getItem('jwt');
    try {
        return await userRoot.get("http://localhost:3000/user/" + id + "/courses", {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        });
    } catch (e) {
        return;
    }
}

//---------------ON PAGE LOAD---------------------

$(document).ready(function () {
    if (localStorage.getItem('name') == null) {
        loadPublicHome();
    } else {
        loadUserHome();
        setupSearchBox()
    }
});

//-----------------LOGOUT/LOGIN------------------------
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
//---------------JOIN A CLASS--------------------

const handleJoin = async function (event) {
    if (localStorage.getItem('name') == null) {
        window.location.replace("login.html");
    } else {
        const id = localStorage.getItem('id');
        const course = event.target.name;
        console.log(course);
        const auth = localStorage.getItem('jwt');
        axios
            .post("http://localhost:3000/user/" + id + "/courses/", {
                data: [course],
                type: "merge"
            }, {
                headers: {
                    Authorization: `Bearer ${auth}`
                }
            }, )
            .then(res => console.log(res))
            .catch(err => console.log(err));
        let c = renderUserClass(course);
        let removed = document.getElementById(course);
        $(removed).remove();
        $('.myClasses').append(c);
    }

    return;
}

//------------REMOVE A CLASS---------------------\

const handleRemove = async function (event) {
    const id = localStorage.getItem('id');
    const course = event.target.name;
    const auth = localStorage.getItem('jwt');

    let courseList = await axios.get("http://localhost:3000/user/" + id + "/courses", {
        headers: {
            Authorization: `Bearer ${auth}`
        }
    });
    let y = courseList.data.result;

    axios.delete("http://localhost:3000/user/" + id + "/courses", {
        headers: {
            Authorization: `Bearer ${auth}`
        }
    });

    let array = [];
    y.forEach(c => {
        if (c != course) {
            array.push(c);
        }
    });

    axios.post("http://localhost:3000/user/" + id + "/courses/", {
        data: array
    }, {
        headers: {
            Authorization: `Bearer ${auth}`
        }
    }, );

    let allClasses = await getAllCourses();
    let classes = allClasses.data.result;

    let toBeRendered = classes.filter(c => "" + c.number + "" == course);

    let renderedClass = renderClass(toBeRendered[0]);

    let removed = document.getElementById(course);

    $(removed).remove();

    $('.moreClasses').append(renderedClass);
}

const handleGo = async function (event) {
    let course = event.target.name;
    localStorage.setItem('class', course);
    window.location.href = "coursePage.html";
}

const getProfessor = function(c){
    if (c == 110) {
        professor = 'Kristopher Jordan';
    } else if (c == 283) {
        professor = 'Jack Snoeyink';
    } else if (c == 290) {
        professor = 'Kristopher Jordan';
    } else if (c == 401) {
        professor = 'Ketan Mayer-Patel';
    } else if (c == 410) {
        professor = 'Paul Stotts';
    } else if (c == 411) {
        professor = 'Montek Singh';
    } else if (c == 426) {
        professor = 'Ketan Mayer-Patel';
    } else if (c == 431) {
        professor = 'Jasleen Kaur';
    } else if (c == 455) {
        professor = 'David Plaisted';
    } else if (c == 521) {
        professor = 'Leonard McMillan';
    } else if (c == 550) {
        professor = 'David Plaisted';
    }

    return professor;
}

const getImage = function(c){
    if (c == 110) {
        image = 'https://cs.unc.edu/wp-content/blogs.dir/130/files/2015/08/kris_jordan-wpcf_120x176.jpg';
    } else if (c == 283) {
        image = 'https://cs.unc.edu/wp-content/blogs.dir/130/files/2013/12/snoeyink-2-wpcf_117x176.jpeg';
    } else if (c == 290) {
        image = 'https://cs.unc.edu/wp-content/blogs.dir/130/files/2015/08/kris_jordan-wpcf_120x176.jpg';
    } else if (c == 401) {
        image = '/kmp.JPG';
    } else if (c == 410) {
        image = 'http://www.cs.unc.edu/~stotts/ISIS/pix/self5.jpeg';
    } else if (c == 411) {
        image = 'https://www.cs.unc.edu/~montek/images/100_5473.JPG';
    } else if (c == 426) {
        image = '/kmp.JPG';
    } else if (c == 431) {
        image = 'http://www.cs.unc.edu/~jasleen/kaur3-cropped.jpg';
    } else if (c == 455) {
        image = 'https://cs.unc.edu/files/2013/12/plaisted.jpeg';
    } else if (c == 521) {
        image = 'https://cs.unc.edu/files/2013/12/mcmillan.jpeg';
    } else if (c == 550) {
        image = 'https://cs.unc.edu/files/2013/12/plaisted.jpeg';
    }

    return image;
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