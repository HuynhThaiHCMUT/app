'use client'

import React, { useState, useEffect } from 'react';
import styles from './components.module.css'

const Spinner = () => {
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <div className={styles.spinnerContainer}>
        {loading ? (
          <div className={styles.spinner}></div>
        ) : (
          <div>Content loaded!</div>
        )}
      </div>
    );
  };
  
  export default Spinner;