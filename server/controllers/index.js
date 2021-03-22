// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};

const defaultDogData = {
  name: 'unknown',
  breed: 'unknown',
  age: 0,
};

let lastAdded = new Cat(defaultData);
let lastDogAdded = new Dog(defaultDogData);

const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllDogs = (req, res, callback) => {
  Dog.find(callback).lean();
};

const readDog = (req, res) => {
  const name1 = req.query.name;

  Dog.findByName(name1, (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }

    return res.json(doc);
  });
};

const getDogName = (req, res) => {
  res.json({ name: lastDogAdded.name });
};

const setDogName = (req, res) => {
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'Name, Breed, and Age are all required' });
  }

  const name = `${req.body.name}`;
  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);
  const savePromise = newDog.save();

  savePromise.then(() => {
    lastDogAdded = newDog;

    res.json({
      name: lastDogAdded.name,
      breed: lastDogAdded.breed,
      age: lastDogAdded.age,
    });
  });

  savePromise.catch((err) => {
    res.status(500).json({ err });
  });

  return res;
};

// Searches for a dog with that name and increases their age by one.
const searchDog = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }

    if (!doc) {
      return res.json({ error: 'No Dogs Found.' });
    }

    const newDog = doc;
    newDog.age++;

    const savePromise = newDog.save();
    savePromise.then(() => {
      res.json({
        name: newDog.name,
        breed: newDog.breed,
        age: newDog.age,
      });
    });

    savePromise.catch((error) => {
      res.status(500).json({
        error,
      });
    });

    return true;
  };

  return Dog.findByName(req.query.name, callback);
};

const readAllCats = (req, res, callback) => {
  Cat.find(callback).lean();
};

const readCat = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }

    return res.json(doc);
  };

  Cat.findByName(name1, callback);
};

const getName = (req, res) => {
  res.json({ name: lastAdded.name });
};

const setName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;
  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);
  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAdded = newCat;

    res.json({
      name: lastAdded.name,
      beds: lastAdded.bedsOwned,
    });
  });

  savePromise.catch((err) => {
    res.status(500).json({ err });
  });

  return res;
};

const searchName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }

    if (!doc) {
      return res.json({ error: 'No Cats Found.' });
    }

    return res.json({
      name: doc.name,
      beds: doc.bedsOwned,
    });
  };

  return Cat.findByName(req.query.name, callback);
};

const updateLast = (req, res) => {
  lastAdded.bedsOwned++;

  const savePromise = lastAdded.save();

  savePromise.then(() => {
    res.json({
      name: lastAdded.name,
      beds: lastAdded.bedsOwned,
    });
  });

  savePromise.catch((err) => {
    res.status(500).json({ err });
  });
};

const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err });
    }

    return res.render('page1', { cats: docs });
  };

  readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err });
    }

    return res.render('page4', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readDog,
  getDogName,
  setDogName,
  searchDog,
  readCat,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
};
