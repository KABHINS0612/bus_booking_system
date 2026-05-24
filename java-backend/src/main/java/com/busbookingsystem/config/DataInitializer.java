package com.busbookingsystem.config;

import com.busbookingsystem.entity.Driver;
import com.busbookingsystem.entity.Vehicle;
import com.busbookingsystem.repository.DriverRepository;
import com.busbookingsystem.repository.UserRepository;
import com.busbookingsystem.repository.VehicleRepository;
import com.busbookingsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) {
        initializeAdmin();
        initializeVehicles();
        initializeDrivers();
    }

    private void initializeAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            userService.createAdmin("admin", "0000000000", "admin123");
        }
    }

    private void initializeVehicles() {
        if (vehicleRepository.count() == 0) {
            vehicleRepository.save(new Vehicle(null, "Toyota Innova", "2022", 7, null));
            vehicleRepository.save(new Vehicle(null, "Honda City", "2021", 5, null));
            vehicleRepository.save(new Vehicle(null, "Maruti Swift", "2023", 5, null));
        }
    }

    private void initializeDrivers() {
        if (driverRepository.count() == 0) {
            driverRepository.save(new Driver(null, "John Doe", 5, null));
            driverRepository.save(new Driver(null, "Jane Smith", 3, null));
            driverRepository.save(new Driver(null, "Michael Johnson", 8, null));
        }
    }
}
