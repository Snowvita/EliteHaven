package com.hms.elite_haven.aspect;

import java.util.Arrays;
import java.util.stream.Collectors;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Pointcut("within(com.hms.elite_haven..*) && !within(com.hms.elite_haven.filter.JwtAuthFilter)")
    public void allMethods() {}

    // Before method execution
    @Before("allMethods()")
    public void logBefore(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String methodName = signature.getName();
        String className = getSimpleClassName(signature.getDeclaringTypeName());
        
        String args = Arrays.stream(joinPoint.getArgs())
                .map(arg -> maskSensitive(arg != null ? arg.toString() : "null"))
                .collect(Collectors.joining(", "));

        logger.info("Entering {}.{}() with arguments: {}", className, methodName, args);
    }

    // After method execution
    @AfterReturning(pointcut = "allMethods()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String methodName = signature.getName();
        String className = getSimpleClassName(signature.getDeclaringTypeName());

        String resultStr = result != null ? maskSensitive(result.toString()) : "null";
        logger.info("Exiting {}.{}() with result: {}", className, methodName, resultStr);
    }

    // After throwing exception
    @AfterThrowing(pointcut = "allMethods()", throwing = "ex")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable ex) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String methodName = signature.getName();
        String className = getSimpleClassName(signature.getDeclaringTypeName());

        logger.error("Exception in {}.{}(): {}", className, methodName, ex.getMessage(), ex);
    }

    // Mask sensitive data like password
    private String maskSensitive(String value) {
        if (value.toLowerCase().contains("password")) {
            return value.replaceAll("(?i)password=.*", "password=****");
        }
        return value;
    }

    // Get simple class name (Controller, Service, Repository)
    private String getSimpleClassName(String fullClassName) {
        String[] parts = fullClassName.split("\\.");
        return parts[parts.length - 1];
    }
}
