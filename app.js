let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req,res,next) {
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = process.env.PORT||2410;
app.listen(port, () => console.log(`Listening on port ${port}!`));

const {carMaster,cars} = require("./carsData.js");

app.get("/svr/cars", function(req,res) {
  let minPrice = req.query.minprice;
  let maxPrice = req.query.maxprice;
  let fuel = req.query.fuel;
  let type = req.query.type;
  let sort = req.query.sort;
  let arr = cars;
  if (minPrice) {
    arr = arr.filter((c1) => (+c1.price) >= (+minPrice));
  }
  if (maxPrice) {
    arr = arr.filter((c1) => (+c1.price) <= (+maxPrice));
  }
  if (fuel) {
    let arr1 = carMaster.filter((c1) => c1.fuel === fuel);
    arr = arr.filter((c1) => arr1.findIndex((c2) => c2.model === c1.model) >= 0);
  }
  if (type) {
    let arr1 = carMaster.filter((c1) => c1.type === type);
    arr = arr.filter((c1) => arr1.findIndex((c2) => c2.model === c1.model) >= 0);
  }
  if (sort) {
    if (sort === "kms") {
      arr = arr.sort((c1,c2) => c1.kms - c2.kms);
    }else if (sort === "price") {
      arr = arr.sort((c1,c2) => c1.price - c2.price);
    }else if (sort === "year") {
      arr = arr.sort((c1,c2) => c1.year - c2.year);
    }
  }
  res.send(arr);
});

app.get("/svr/carmaster", function(req,res) {
  res.send(carMaster);
});

app.get("/svr/carmaster/:id", function(req,res) {
  let id = req.params.id;
  let index = cars.findIndex((c1) => c1.id === id);
  if (index >= 0) {
    let car = cars[index];
    let obj = {car,carMaster};
    res.send(obj);
  }else {
    res.status(404).send("No car found");
  }
});

app.post("/svr/carMaster", function(req,res) {
  let body = req.body;
  cars.push(body);
  res.send(body);
});

app.put("/svr/carMaster/:id", function(req,res) {
  let id = req.params.id;
  let body = req.body;
  let index = cars.findIndex((c1) => c1.id === id);
  if (index >= 0) {
    cars[index] = body;
    res.send(body);
  }else {
    res.status(404).send("No car found");
  }
});

app.delete("/svr/cars/:id", function(req,res) {
  let id = req.params.id;
  let index = cars.findIndex((c1) => c1.id === id);
  if (index >= 0) {
    let deletedCar = cars.splice(index,1);
    res.send(deletedCar);
  }
});