package com.busbookingsystem.controller;

import com.busbookingsystem.entity.User;
import com.busbookingsystem.entity.Vehicle;
import com.busbookingsystem.entity.Driver;
import com.busbookingsystem.service.TripService;
import com.busbookingsystem.service.UserService;
import com.busbookingsystem.service.VehicleService;
import com.busbookingsystem.service.DriverService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
public class TripController {

    @Autowired
    private TripService tripService;

    @Autowired
    private UserService userService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private DriverService driverService;

    @PostMapping("/book_trip")
    public String bookTrip(HttpSession session,
                          @RequestParam Long vehicle,
                          @RequestParam Long driver,
                          @RequestParam String start_date,
                          @RequestParam String end_date,
                          @RequestParam String pickup_point,
                          @RequestParam String end_point,
                          RedirectAttributes redirectAttributes) {
        
        Long userId = (Long) session.getAttribute("user_id");
        if (userId == null) {
            return "redirect:/";
        }

        Optional<User> user = userService.getUserById(userId);
        Optional<Vehicle> vehicleOpt = vehicleService.getVehicleById(vehicle);
        Optional<Driver> driverOpt = driverService.getDriverById(driver);

        if (user.isPresent() && vehicleOpt.isPresent() && driverOpt.isPresent()) {
            tripService.bookTrip(user.get(), vehicleOpt.get(), driverOpt.get(),
                    start_date, end_date, pickup_point, end_point);
        }

        return "redirect:/?tab=history";
    }

    @PostMapping("/cancel_trip/{trip_id}")
    public String cancelTrip(@PathVariable Long trip_id, HttpSession session,
                            RedirectAttributes redirectAttributes) {
        
        Long userId = (Long) session.getAttribute("user_id");
        if (userId == null) {
            return "redirect:/";
        }

        if (tripService.userCanCancelTrip(userId, trip_id)) {
            tripService.cancelTrip(trip_id);
        }

        return "redirect:/?tab=history";
    }
}

