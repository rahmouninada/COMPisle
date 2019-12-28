$(function () {
  const pubRoot = new axios.create({
    baseURL: "http://localhost:3000/public"
  });

  async function createCourses() {
    return await pubRoot.post(`/authors/`, {
      data: courses = [{
        'number': 110,
        'professor': 'Kristopher Jordan'
      },
      {
        'number': 283,
        'professor': 'Jack Snoeyink'
      },
      {
        'number': 290,
        'professor': 'Kristopher Jordan'
      },
      {
        'number': 401,
        'professor': 'Ketan Mayer-Patel'
      },
      {
        'number': 410,
        'professor': 'Paul Stotts'
      },
      {
        'number': 411,
        'professor': 'Montek Singh'
      },
      {
        'number': 426,
        'professor': 'Ketan Mayer-Patel'
      },
      {
        'number': 431,
        'professor': 'Jasleen Kaur'
      },
      {
        'number': 455,
        'professor': 'David Plaisted'
      },
      {
        'number': 521,
        'professor': 'Leonard McMillan'
      },
      {
        'number': 550,
        'professor': 'David Plaisted'
      }

      ]
    })
  }

  async function getAllCourses() {
    return await pubRoot.get('/authors');
  }

  (async () => {
    await createCourses({});
    let { data } = await getAllCourses();
    console.log(data.result);
    console.log('Comp ' + data.result[0].number);
    console.log('Professor: ' + data.result[0].professor);
  })();
}
);
