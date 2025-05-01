document.addEventListener('DOMContentLoaded', async () => {
    const vehicleSelect = document.getElementById('vehicle');
    const form = document.getElementById('car-mod-form');
    const customerId = localStorage.getItem('userId');
    console.log("Customer ID loaded from localStorage:", customerId);
    
    //let i = 0;

    try {
        const vehicleRes = await fetch('/api/vehicles');
        const vehicles = await vehicleRes.json();

        const defaultOption = document.createElement('option');
        defaultOption.value = 0;
        defaultOption.textContent = "Select car: ";
        vehicleSelect.appendChild(defaultOption);
    
        vehicles.forEach(vehicle => {
          //let vechileID = vehicle.customerId;
          console.log(vehicle.customerId._id);
          if (customerId == vehicle.customerId._id) {
          //console.log(vehicle.customerId);
            const option = document.createElement('option');
            option.value = vehicle._id;
            //option.makes = vehicle.make;
            //option.model = vehicle.model;
            //option.year = vehicle.year;
            //option.color = vehicle.color;
            //option.licensePlate = vehicle.licensePlate;
            option.textContent = `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`;
            //option.spotNum = i;
            //i++;
            vehicleSelect.appendChild(option);
          }
          vehicleSelect.addEventListener('change', function() {
            vehicles.forEach(vehicle => {
              if (vehicleSelect.value == vehicle._id) {
                console.log(vehicle._id);
                localStorage.setItem('carID', vehicle._id);
                localStorage.setItem('carMake', vehicle.make);
                localStorage.setItem('carModel', vehicle.model);
                localStorage.setItem('carColor', vehicle.color);
                localStorage.setItem('carYear', vehicle.year);
                location.reload();
              }
            });
          });
        });
        //carSelect();
        //console.log(vehicleSelect.querySelectorAll('vehicle'));
      } catch (err) {
        alert('Error loading vehicles.');
        console.error(err);
      }
      console.log(localStorage.getItem('carMake'));
      console.log(localStorage.getItem('carModel'));
      console.log(localStorage.getItem('carColor'));
      console.log(localStorage.getItem('carYear'));
     // form.addEventListener('submit', deleteVehicleUse());
      //vehicleSelect.addEventListener('change', function() {
        //vehicles.forEach(vehicle => {
        //  if (vehicleSelect.value == vehicle._id) {
        //    console.log(vehicle._id);
        //  }
      //  })
      //});
    //carSelect();
    //console.log(carMake);
    document.getElementById('deleteButton').addEventListener('click', async function(event) {
      event.preventDefault(); // Prevent form submission
      await deleteVehicleUse();
  });

  document.getElementById('car-mod-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent actual form submission (page reload)

    const carID = localStorage.getItem('carID');

    if (!carID) {
        alert('No vehicle selected.');
        return;
    }

    const updatedVehicle = {
        make: document.getElementById('vehicleMake').value,
        model: document.getElementById('vehicleModel').value,
        color: document.getElementById('vehicleColor').value,
        year: document.getElementById('vehicleYear').value,
        notes: document.getElementById('vehicleNotes').value
    };

    try {
      console.log("Updating vehicle with ID:", carID);

        const res = await fetch(`http://localhost:5000/api/vehicles/${carID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedVehicle)
        });

        if (res.ok) {
            alert('Vehicle updated successfully!');
            location.href = 'myCars'; // Redirect after success
        } else {
            const errorData = await res.json();
            alert('Update failed: ' + (errorData.error || res.statusText));
        }
    } catch (err) {
        console.error('Error updating vehicle:', err);
        alert('An error occurred while updating the vehicle.');
    }
});
});


function carSelect() {
  let carSelection = document.getElementById('vehicle');

  carSelection.addEventListener('change', function() {
    localStorage.setItem('carMake', vehicle.make),
    localStorage.setItem('carModel', carSelection.model),
    localStorage.setItem('carColor', carSelection.color),
    localStorage.setItem('carYear', carSelection.year)//,
    //location.reload()
  });
  console.log(vehicle.make);
};

async function deleteVehicleUse() {
  try {
      const vehicleRes = await fetch('http://localhost:5000/api/vehicles');
      const vehicles = await vehicleRes.json();

      const carID = localStorage.getItem('carID');
      console.log("Deleting car with ID:", carID);

      const targetVehicle = vehicles.find(vehicle => vehicle._id === carID);

      if (targetVehicle) {
          const res = await fetch(`http://localhost:5000/api/vehicles/${carID}`, {
              method: 'DELETE'
          });

          if (res.ok) {
              alert("Vehicle deleted.");
              location.href = 'myCars'; // Redirect to cars page
          } else {
              alert("Failed to delete vehicle.");
          }
      } else {
          alert("Vehicle not found.");
      }
  } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("An error occurred while deleting the vehicle.");
  }
}

//const dltBtn = document.getElementById('deleteButton');

/*document.getElementById("deleteButton").addEventListener('click', async () => {
  preventDefault();
  try {
      const vehicleRes2 = await fetch('/api/vehicles');
      const vehicles2 = await vehicleRes2.json();

      console.log(localStorage.getItem('carID'));


      vehicles2.foreach(vehicle => {
          if (localStorage.getItem('carID') == vehicle._id) {
              fetch(`/api/vehicles/${localStorage.getItem('carID')}`, {
                  method: 'DELETE'
              })
          }
      });
  } catch (err) {
      
  }
});*/