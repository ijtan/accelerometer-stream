const checkIfGyroIsEnabled = async () => {
  return new Promise((resolve) => {
    const id = setTimeout(() => {
      document.getElementById("nodeviceorientation").style.display = "block";
      resolve(false);
    }, 500);
    const resolveGyroCheck = () => {
      clearTimeout(id);
      resolve(true);
      document.getElementById("nodeviceorientation").style.display = "none";
      window.removeEventListener("deviceorientation", resolveGyroCheck);
    };
    window.addEventListener("deviceorientation", resolveGyroCheck);
  });
};

const checkIfMotionIsEnabled = async () => {
  // alert("checking mototo");
  return new Promise((resolve) => {
    const id = setTimeout(() => {
      document.getElementById("nomotion").style.display = "block";
      resolve(false);
    }, 500);
    const resolveMotionCheck = () => {
      clearTimeout(id);
      resolve(true);
      document.getElementById("nomotion").style.display = "none";
      window.removeEventListener("devicemotion", resolveMotionCheck);
      // alert('Motion wohoo');
    };
    window.addEventListener("devicemotion", resolveMotionCheck);
    // alert("Motion give pls");
  });
};

//open websocket
const ws = new WebSocket("wss://192.168.0.2:8000/ws");
ws.onopen = () => {
  console.log("connected");
  ws.send("hello");
};


const batch_motion = [];
const batch_motion_size = 10;
// const batch_motion_interval = 1000;
const batch_orientation = [];
const batch_orientation_size = 10;
// const batch_orientation_interval = 1000;

sent = 0;
function sendData(data, label){
  labelled = {
    data: data,
    label: label
  };
  const data_str = JSON.stringify(labelled);
  ws.send(data_str);
  
  batch_motion.length = 0;
  batch_orientation.length = 0;

  sent += 1;
  document.getElementById("sent").innerHTML = sent.toString();
}





function updateDeviceOrientationData(e) {

  const dataText = `alpha: ${e.alpha} <br>
    beta: ${e.beta} <br>
    gamma: ${e.gamma} <br>`;
  document.getElementById("deviceorientationdata").innerHTML = dataText;

  //objextify it
  const data = {
    alpha: e.alpha,
    beta: e.beta,
    gamma: e.gamma,
    time: e.timeStamp,
  };

  batch_orientation.push(data);
  if(batch_orientation.length >= batch_orientation_size){
    sendData(batch_orientation, "orientation");
    data = null;
    batch_orientation = [];

  }
  
};

async function updateDeviceMotion(e){

  // const dataText = `x: ${e.acceleration.x} <br>
  //   y: ${e.acceleration.y} <br>
  //   z: ${e.acceleration.z} <br>`;
  // document.getElementById("devicemotiondata").innerHTML = dataText;

  //objectify it
  // alert('Motion');
  // alert(e);
  const data = {
    x: e.accelerationIncludingGravity.x,
    y: e.accelerationIncludingGravity.y,
    z: e.accelerationIncludingGravity.z,
    time: e.timeStamp,
  };

  batch_motion.push(data);
  if(batch_motion.length >= batch_motion_size){
    sendData(batch_motion, "motion");
    data = null;
    batch_motion = [];
  }
  
}

window.addEventListener("deviceorientation", updateDeviceOrientationData);
// window.addEventListener("devicemotion", updateDeviceMotion);


const requestOrientationAccess = async (e) => {
  if (
    typeof DeviceOrientationEvent === "undefined" ||
    !DeviceOrientationEvent.requestPermission
  ) {
    console.log("no DeviceOrientationEvent.requestPermission present.");
    return false;
  }
  alert(
    `DeviceOrientationEvent.requestPermission function exists: ${!!DeviceOrientationEvent.requestPermission}`
  );

  return DeviceOrientationEvent.requestPermission(e).then((permission) => {
    alert(`permission: ${permission}.`);
    return permission === "granted";
  });
};

const requestMotionAccess = async (e) => {
  alert('Will Request Motion Access');
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    // (optional) Do something before API request prompt.
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        // (optional) Do something after API prompt dismissed.
        if (response == "granted") {
          alert(`permission: granted!!`);
          return permission === "granted";
          // window.addEventListener("devicemotion", (e) => {
          //   // do something for 'e' here.
          //   return permission=== "granted";
          // });
        }
      })
      .catch(console.error);
  } else {
    alert("DeviceMotionEvent is not defined");
  }
}

document
  .getElementById("requestaccess")
  .addEventListener("click", async (e) => {
    try {
      const nodevicemotion = await requestMotionAccess(e);
      // alert(`gotMotionbAccess: ${gotMotionAccess}`);

      const gotOrientationAccess = await requestOrientationAccess(e);
      alert(`gotOrientationAccess: ${gotOrientationAccess}`);

      init();
    } catch (e) {
      alert('Error: '+e);
    }
  });

document.getElementById("opensettings").addEventListener("click", async (e) => {
  window.location.href = "prefs:root=Safari";
});

const init = async () => {
  const isGyroEnabled = await checkIfGyroIsEnabled();
  if (!isGyroEnabled) {
    showNoDeviceOrientationMessage();
    return;
  }



  const isMotionEnabled = await checkIfMotionIsEnabled();
  if (!isMotionEnabled) {
    // showNoDeviceMotionMessage();
    alert('No Motion');
    return;
  }else{
    // alert('Motion all good');
    window.addEventListener("devicemotion", updateDeviceMotion);
  }

  // showDeviceOrientationMessage();
  // showDeviceMotionMessage();W
};

function sayGotMoto() {
  alert("got a new moto");
}

init();
