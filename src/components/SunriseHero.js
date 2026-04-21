"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import HomeHeroActions from "@/components/HomeHeroActions";

export default function SunriseHero({ title, subtitle }) {
  const { scrollY } = useScroll();
  const sunY = useTransform(scrollY, [0, 600], [0, -200]);
  const skyOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const mountainY = useTransform(scrollY, [0, 600], [0, 50]);
  const contentY = useTransform(scrollY, [0, 400], [0, 100]);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "90vh", md: "100vh" },
        display: "flex",
        alignItems: "center",
        isolation: "isolate",
      }}
    >
      {/* Animated Sky Gradient Background */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: skyOpacity,
          background:
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 15%, #5b2c6f 30%, #c43c68 50%, #ff6b35 70%, #ffa751 85%, #ffd89b 100%)",
          zIndex: -3,
        }}
        animate={{
          background: [
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 15%, #5b2c6f 30%, #c43c68 50%, #ff6b35 70%, #ffa751 85%, #ffd89b 100%)",
            "linear-gradient(180deg, #2d1b4e 0%, #5b2c6f 15%, #c43c68 30%, #ff6b35 50%, #ffa751 70%, #ffd89b 85%, #fff4d6 100%)",
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 15%, #5b2c6f 30%, #c43c68 50%, #ff6b35 70%, #ffa751 85%, #ffd89b 100%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Radial Glow from Sun */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 70%, rgba(255, 215, 125, 0.4) 0%, rgba(255, 107, 53, 0.2) 25%, transparent 50%)",
          zIndex: -2,
        }}
      />

      {/* Animated Sun with Rays */}
      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          y: sunY,
          zIndex: -1,
        }}
      >
        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          style={{ filter: "drop-shadow(0 0 80px rgba(255, 180, 80, 0.8))" }}
        >
          <defs>
            <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff4d6" />
              <stop offset="40%" stopColor="#ffd89b" />
              <stop offset="70%" stopColor="#ffa751" />
              <stop offset="100%" stopColor="#ff6b35" />
            </radialGradient>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd89b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer glow */}
          <motion.circle
            cx="250"
            cy="250"
            fill="url(#sunGlow)"
            initial={{ r: 200, opacity: 0.5 }}
            animate={{
              r: [180, 220, 180],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Rotating rays */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{
              duration: 120,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ transformOrigin: "250px 250px" }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x="248"
                y="50"
                width="4"
                height="60"
                fill="#fff4d6"
                opacity="0.6"
                transform={`rotate(${i * 30} 250 250)`}
              />
            ))}
          </motion.g>

          {/* Counter-rotating shorter rays */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{
              duration: 80,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ transformOrigin: "250px 250px" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <rect
                key={i}
                x="249"
                y="90"
                width="2"
                height="40"
                fill="#ffd89b"
                opacity="0.7"
                transform={`rotate(${i * 45 + 22.5} 250 250)`}
              />
            ))}
          </motion.g>

          {/* Main sun body */}
          <circle cx="250" cy="250" r="110" fill="url(#sunGradient)" />

          {/* Inner bright core */}
          <motion.circle
            cx="250"
            cy="250"
            fill="#fff4d6"
            initial={{ r: 85, opacity: 0.85 }}
            animate={{
              opacity: [0.7, 1, 0.7],
              r: [80, 90, 80],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>

      {/* Floating Particles */}
      {Array.from({ length: 30 }).map((_, i) => {
        const seed = (i * 2654435761) % 2 ** 32;
        const r1 = ((seed * 9301 + 49297) % 233280) / 233280;
        const r2 = ((seed * 48271) % 2147483647) / 2147483647;
        const r3 = ((seed * 16807) % 2147483647) / 2147483647;
        const r4 = ((seed * 69069 + 1) % 2 ** 31) / 2 ** 31;
        const size = r1 * 4 + 2;
        const startX = r2 * 100;
        const duration = r3 * 15 + 15;
        const delay = r4 * 15;
        const drift = (r1 - 0.5) * 100;
        return (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              left: `${startX}%`,
              bottom: "-20px",
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#fff4d6" : i % 3 === 1 ? "#ffd89b" : "#ffa751",
              boxShadow: "0 0 10px rgba(255, 215, 125, 0.8)",
              zIndex: 0,
            }}
            animate={{
              y: ["0vh", "-110vh"],
              x: [0, drift],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}

      {/* Mountain Silhouettes */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          y: mountainY,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          {/* Back mountains */}
          <path
            d="M0,300 L120,200 L240,250 L360,150 L480,220 L600,180 L720,230 L840,160 L960,210 L1080,170 L1200,240 L1320,190 L1440,220 L1440,400 L0,400 Z"
            fill="#3a1c3e"
            opacity="0.7"
          />
          {/* Middle mountains */}
          <path
            d="M0,350 L100,260 L220,300 L340,230 L460,290 L580,240 L700,300 L820,250 L940,290 L1060,260 L1180,310 L1300,270 L1440,300 L1440,400 L0,400 Z"
            fill="#2a1230"
            opacity="0.85"
          />
          {/* Front mountains */}
          <path
            d="M0,400 L80,320 L180,360 L280,310 L380,360 L480,320 L580,370 L680,330 L780,370 L880,340 L980,380 L1080,340 L1200,380 L1320,350 L1440,380 L1440,400 L0,400 Z"
            fill="#1a0a1f"
          />
        </svg>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          y: contentY,
        }}
      >
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Typography
                component="div"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: { xs: "0.85rem", md: "1rem" },
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#ffd89b",
                  mb: 3,
                  textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                ✦ A New Day Begins ✦
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: "3.5rem", sm: "5rem", md: "7rem" },
                  fontWeight: 800,
                  lineHeight: 0.95,
                  letterSpacing: "-0.04em",
                  color: "#ffffff",
                  mb: 3,
                  textShadow: "0 4px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
                  background: "linear-gradient(180deg, #ffffff 0%, #ffd89b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {title}
              </Typography>
            </motion.div>

            {subtitle ? (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "1.25rem", md: "1.6rem" },
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: "rgba(255, 255, 255, 0.95)",
                    maxWidth: 640,
                    mb: 5,
                    textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                    mx: { xs: "auto", md: 0 },
                  }}
                >
                  {subtitle}
                </Typography>
              </motion.div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", justifyContent: "inherit" }}
            >
              <HomeHeroActions />
            </motion.div>
          </Box>
        </Container>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 2,
          delay: 1.5,
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          color: "#ffffff",
          fontSize: "0.75rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          textAlign: "center",
          textShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll
          <Box sx={{ fontSize: "1.5rem", mt: 0.5 }}>↓</Box>
        </motion.div>
      </motion.div>
    </Box>
  );
}
