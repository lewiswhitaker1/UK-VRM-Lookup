async function searchVehicle() {
    const regNumber = document.getElementById('regNumber').value.trim().toUpperCase();
    
    if (!regNumber) {
        alert('Please enter a registration number');
        return;
    }

    document.getElementById('loading').style.display = 'flex';
    document.getElementById('results').style.display = 'none';
    document.getElementById('vehicle-image').style.display = 'none';
    document.getElementById('no-image-message').style.display = 'block';

    try {
        const vehicleResponse = await fetch(`/api/vehicle-lookup?vrm=${regNumber}`);

        if (!vehicleResponse.ok) {
            throw new Error('Vehicle not found');
        }

        const vehicleData = await vehicleResponse.json();
        
        if (!vehicleData.Results || !vehicleData.Results.VehicleDetails || !vehicleData.Results.VehicleDetails.VehicleIdentification) {
            throw new Error('No vehicle details found');
        }

        const vehicleDetails = vehicleData.Results.VehicleDetails.VehicleIdentification;
        const modelDetails = vehicleData.Results.ModelDetails?.ModelIdentification;
        const bodyDetails = vehicleData.Results.ModelDetails?.BodyDetails;
        
        document.getElementById('make').textContent = modelDetails?.Make || vehicleDetails.DvlaMake || 'N/A';
        
        const range = modelDetails?.Range || '';
        const modelValue = modelDetails?.Model || vehicleDetails.DvlaModel || 'N/A';
        const model = `(${modelValue})`;
        document.getElementById('model').textContent = range ? `${range} ${model}` : model;
        
        const year = vehicleDetails.YearOfManufacture || 'N/A';
        const series = modelDetails?.Series ? `(${modelDetails.Series})` : '';
        document.getElementById('year').textContent = series ? `${year} ${series}` : year;
        
        const doors = bodyDetails?.NumberOfDoors || '';
        const bodyStyle = bodyDetails?.BodyStyle || '';
        
        if (doors && bodyStyle) {
            document.getElementById('bodyStyle').textContent = `${doors} Door ${bodyStyle}`;
        } else if (doors) {
            document.getElementById('bodyStyle').textContent = `${doors} Door`;
        } else if (bodyStyle) {
            document.getElementById('bodyStyle').textContent = bodyStyle;
        } else {
            document.getElementById('bodyStyle').textContent = 'N/A';
        }
        
        try {
            const imageResponse = await fetch(`/api/vehicle-images?vrm=${regNumber}`);
            
            if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                
                if (imageData.Results && 
                    imageData.Results.VehicleImageDetails && 
                    imageData.Results.VehicleImageDetails.VehicleImageList && 
                    imageData.Results.VehicleImageDetails.VehicleImageList.length > 0) {
                    
                    const imageUrl = imageData.Results.VehicleImageDetails.VehicleImageList[0].ImageUrl;
                    const vehicleImage = document.getElementById('vehicle-image');

                    vehicleImage.src = imageUrl;
                    vehicleImage.style.display = 'block';
                    document.getElementById('no-image-message').style.display = 'none';
                } else {
                    document.getElementById('vehicle-image').style.display = 'none';
                    document.getElementById('no-image-message').style.display = 'block';
                }
            } else {
                document.getElementById('vehicle-image').style.display = 'none';
                document.getElementById('no-image-message').style.display = 'block';
            }
        } catch (imageError) {
            console.error('Error fetching vehicle image:', imageError);
            document.getElementById('vehicle-image').style.display = 'none';
            document.getElementById('no-image-message').style.display = 'block';
        }

        document.getElementById('results').style.display = 'block';
        
    } catch (error) {
        alert('Error: ' + error.message);
        document.getElementById('make').textContent = '-';
        document.getElementById('model').textContent = '-';
        document.getElementById('year').textContent = '-';
        document.getElementById('bodyStyle').textContent = '-';
        document.getElementById('results').style.display = 'block';
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

document.getElementById('regNumber').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchVehicle();
    }
}); 