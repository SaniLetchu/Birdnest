import { Application, Server } from "./deps.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import { router } from "./routes/routes.js";

import { fetchDrones, fetchPilot } from "./utils/fetchBirdnest.js";
import { distanceFromNest } from "./utils/distanceUtils.js";
import { findViolationById, addViolation, updateViolationLastSeenById, updateViolationDistanceById, listViolations, deleteOldViolations, updateViolationPilotInformationById } from "./services/violationService.js";

const app = new Application();
app.use(oakCors());

app.use(errorMiddleware);
app.use(renderMiddleware);
app.use(router.routes());

const io = new Server();

//Check the drone locations and possible violations every 2 second
setInterval(async () => {
  let drones = await fetchDrones();
  drones.forEach(async (drone) => {
    let serialNumber = drone.children[0].content;
    let y = drone.children[7].content;
    let x = drone.children[8].content;
    let distance = distanceFromNest(x , y);
  
    let response = await findViolationById(serialNumber)
    let existsInDb = response.length

    if(distance <= 100) {
      //Already exists. Update last seen and distance if shorter than in db
      if(existsInDb !== 0) {
        let violationData = response[0];
        if(violationData.closest_distance > distance) {
          updateViolationDistanceById(serialNumber, distance);
        }
        updateViolationLastSeenById(serialNumber);
        //Update pilot information if it has failed
        if(violationData.pilot_name == null) {
          let pilot = await fetchPilot(serialNumber);
          let name = null;
          let phone = null;
          let email = null;

          if(pilot) {
            name = pilot.firstName + " " + pilot.lastName;
            phone = pilot.phoneNumber;
            email = pilot.email;
          }
          await updateViolationPilotInformationById(serialNumber, name, email, phone);
        }
      }
      else {
        let pilot = await fetchPilot(serialNumber);
        let name = null;
        let phone = null;
        let email = null;

        if(pilot) {
          name = pilot.firstName + " " + pilot.lastName;
          phone = pilot.phoneNumber;
          email = pilot.email;
        }
        await addViolation(serialNumber, distance, name, email, phone)
      }
    }
    //Update last seen
    else if(existsInDb !== 0) {
      updateViolationLastSeenById(serialNumber);
    }
  })
}, 2000);

//Remove old data from db every 10 minutes to stay in fly.io's free tier storage
setInterval(async () => {
  await deleteOldViolations();
}, 600000)

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  let count = 0

  let interval = setInterval(async () => {
    count++;
    let violations = await listViolations()
    socket.emit("violations", violations);
  }, 2000);

  socket.on("disconnect", (reason) => {
    clearInterval(interval);
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});


const handler = io.handler(async (req) => {
  return await app.handle(req) || new Response(null, { status: 404 });
});

export { handler };