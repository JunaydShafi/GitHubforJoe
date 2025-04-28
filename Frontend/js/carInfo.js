document.addEventListener('DOMContentLoaded', async () => {
    const vehicleSelect = document.getElementById('vehicle');

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
      //vehicleSelect.addEventListener('change', function() {
        //vehicles.forEach(vehicle => {
        //  if (vehicleSelect.value == vehicle._id) {
        //    console.log(vehicle._id);
        //  }
      //  })
      //});
    //carSelect();
    //console.log(carMake);
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