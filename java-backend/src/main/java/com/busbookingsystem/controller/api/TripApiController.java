package com.busbookingsystem.controller.api;

import com.busbookingsystem.dto.ApiDtos;
import com.busbookingsystem.dto.AuthDtos;
import com.busbookingsystem.entity.Role;
import com.busbookingsystem.entity.User;
import com.busbookingsystem.security.SecurityUtils;
import com.busbookingsystem.service.DriverService;
import com.busbookingsystem.service.TripService;
import com.busbookingsystem.service.UserService;
import com.busbookingsystem.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripApiController {

    @Autowired
    private TripService tripService;

    @Autowired
    private UserService userService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private DriverService driverService;

    @GetMapping
    public List<ApiDtos.TripDto> listTrips() {
        if (SecurityUtils.hasRole(Role.ADMIN)) {
            return tripService.getAllTrips().stream()
                    .map(ApiDtos.TripDto::from)
                    .toList();
        }
        User user = currentUser();
        return tripService.getTripsByUserId(user.getId()).stream()
                .map(ApiDtos.TripDto::from)
                .toList();
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookTrip(@RequestBody ApiDtos.BookTripRequest request) {
        User user = currentUser();
        var vehicle = vehicleService.getVehicleById(request.vehicleId());
        var driver = driverService.getDriverById(request.driverId());
        if (vehicle.isEmpty() || driver.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new AuthDtos.ErrorResponse("Invalid vehicle or driver"));
        }
        var trip = tripService.bookTrip(
                user,
                vehicle.get(),
                driver.get(),
                request.startDate(),
                request.endDate(),
                request.pickupPoint(),
                request.endPoint());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiDtos.TripDto.from(trip));
    }

    @PostMapping("/{tripId}/cancel")
    public ResponseEntity<?> cancelTrip(@PathVariable Long tripId) {
        if (SecurityUtils.hasRole(Role.ADMIN)) {
            tripService.cancelTrip(tripId);
            return ResponseEntity.noContent().build();
        }
        User user = currentUser();
        if (!tripService.userCanCancelTrip(user.getId(), tripId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new AuthDtos.ErrorResponse("Cannot cancel this trip"));
        }
        tripService.cancelTrip(tripId);
        return ResponseEntity.noContent().build();
    }

    private User currentUser() {
        return userService.findByUsername(SecurityUtils.currentUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }
}
