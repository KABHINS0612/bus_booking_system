package com.busbookingsystem.controller.api;

import com.busbookingsystem.dto.ApiDtos;
import com.busbookingsystem.dto.AuthDtos;
import com.busbookingsystem.service.DriverService;
import com.busbookingsystem.service.TripService;
import com.busbookingsystem.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminApiController {

    @Autowired
    private TripService tripService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private DriverService driverService;

    @PostMapping("/vehicles")
    public ResponseEntity<ApiDtos.VehicleDto> addVehicle(@RequestBody ApiDtos.AddVehicleRequest request) {
        var vehicle = vehicleService.addVehicle(request.name(), request.model(), request.capacity());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiDtos.VehicleDto.from(vehicle));
    }

    @DeleteMapping("/vehicles/{vehicleId}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long vehicleId) {
        if (!vehicleService.deleteVehicle(vehicleId)) {
            return ResponseEntity.badRequest()
                    .body(new AuthDtos.ErrorResponse("Vehicle is in use and cannot be deleted"));
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/drivers")
    public ResponseEntity<ApiDtos.DriverDto> addDriver(@RequestBody ApiDtos.AddDriverRequest request) {
        var driver = driverService.addDriver(request.name(), request.experience());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiDtos.DriverDto.from(driver));
    }

    @DeleteMapping("/drivers/{driverId}")
    public ResponseEntity<?> deleteDriver(@PathVariable Long driverId) {
        if (!driverService.deleteDriver(driverId)) {
            return ResponseEntity.badRequest()
                    .body(new AuthDtos.ErrorResponse("Driver is assigned to a trip and cannot be deleted"));
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/trips/{tripId}/cancel")
    public ResponseEntity<Void> cancelTrip(@PathVariable Long tripId) {
        tripService.cancelTrip(tripId);
        return ResponseEntity.noContent().build();
    }
}
