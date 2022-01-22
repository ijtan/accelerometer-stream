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

document.getElementById("deviceorientationdata").innerHTML = "test";

//open websocket
const ws = new WebSocket("wss://192.168.0.2:8000/ws");
ws.onopen = () => {
  console.log("connected");
  ws.send("hello");
};


  
continue_send = true;
function updateDeviceOrientationData(e) {
  if(!continue_send) return;
  // only send every 5th data point

  const dataText = `alpha: ${e.alpha} <br>
    beta: ${e.beta} <br>
    gamma: ${e.gamma} <br>`;
  document.getElementById("deviceorientationdata").innerHTML = dataText;

  //jsonify it
  const data = {
    alpha: e.alpha,
    beta: e.beta,
    gamma: e.gamma,
  };



  const data_str = JSON.stringify(data);

  ws.send(data_str);
  // continue_send = false;

  // wait for reply from servee
  // ws.onmessage = (event) => {
  //   console.log(event.data);
  //   continue_send = true;
  // };
  
};

async function updateDeviceMotion(e){
  if(!continue_send) return;
  // only send every 5th data point

  const dataText = `x: ${e.acceleration.x} <br>
    y: ${e.acceleration.y} <br>
    z: ${e.acceleration.z} <br>`;
  document.getElementById("devicemotiondata").innerHTML = dataText;

  //jsonify it
  const data = {
    x: e.acceleration.x,
    y: e.acceleration.y,
    z: e.acceleration.z,
  };

  const data_str = JSON.stringify(data);

  ws.send(data_str);
  // continue_send = false;

  // wait for reply from servee
  // ws.onmessage = (event) => {
  //   console.log(event.data);
  //   continue_send = true;
  // };
  
}

window.addEventListener("deviceorientation", updateDeviceOrientationData);
// window.addEventListener("devicemotion", updateDeviceMotion);


const showNoDeviceOrientationMessage = () => {
  document.getElementById("nodeviceorientation").style.display = "block";
};

const showDeviceOrientationMessage = () => {
  document.getElementById("deviceorientation").style.display = "block";
};

const requestAccess = async (e) => {
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

document
  .getElementById("requestaccess")
  .addEventListener("click", async (e) => {
    try {
      const gotAccess = await requestAccess(e);
      alert(`gotAccess: ${gotAccess}`);
      init();
    } catch (e) {
      alert(e);
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

  showDeviceOrientationMessage();
};

init();
