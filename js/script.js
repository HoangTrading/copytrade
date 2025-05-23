       // Initialize AOS
       AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Particle configuration
    const particleConfig = {
        particles: {
            number: { value: 50, density: { enable: true, value_area: 800 } },
            color: { value: '#22d3ee' },
            shape: { type: 'circle' },
            opacity: { value: 0.3, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: false },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        },
        retina_detect: true
    };

    // Initialize Particles.js for each section
    particlesJS('particles-hero', particleConfig);
    particlesJS('particles-stats', particleConfig);
    particlesJS('particles-profit-chart', particleConfig);
    particlesJS('particles-how', particleConfig);
    particlesJS('particles-trader', particleConfig);
    particlesJS('particles-faq', particleConfig);
    particlesJS('particles-testimonials', particleConfig);
    particlesJS('particles-cta', particleConfig);
    particlesJS('particles-footer', particleConfig);

    // Smooth Scroll for Menu Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            // Đóng menu mobile nếu đang mở
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                document.getElementById('menu-toggle').classList.remove('active');
            }
        });
    });

    // Toggle Mobile Menu
    document.getElementById('menu-toggle').addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.toggle('hidden');
        this.classList.toggle('active');
    });
  
    
    // Lazy Load + Animations
    document.addEventListener("DOMContentLoaded", function() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

        // ROI Calculator Logic
        const roiCalculator = {
            init() {
                this.cacheElements();
                this.bindEvents();
                this.updateROI();
            },
            cacheElements() {
                this.amountInput = document.querySelector('#investmentAmount');
                this.amountValue = document.querySelector('#amountValue');
                this.monthSelect = document.querySelector('#investmentMonths');
                this.roiOutput = document.querySelector('#roiResult');
            },
            bindEvents() {
                if (this.amountInput) this.amountInput.addEventListener('input', () => this.updateROI());
                if (this.monthSelect) this.monthSelect.addEventListener('change', () => this.updateROI());
            },
            updateROI() {
                const amount = parseFloat(this.amountInput?.value || 0);
                const months = parseInt(this.monthSelect?.value || 1);
                const roi = amount * Math.pow(1.12, months) - amount;
                if (this.amountValue) this.amountValue.textContent = `$${amount.toLocaleString()}`;
                if (this.roiOutput) this.roiOutput.textContent = `$${roi.toFixed(0).toLocaleString()}`;
            }
        };

        roiCalculator.init();
    });


    // Cấu hình Firebase
    const firebaseConfig = {
      // Thay bằng cấu hình của bạn từ Firebase Console
      apiKey: "AIzaSyBN0JatW7Z94XcLWJBLMaVPV4_vzLI5zdQ",
      authDomain: "hoangprovn-e7567.firebaseapp.com",
      databaseURL: "https://hoangprovn-e7567-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "hoangprovn-e7567",
      storageBucket: "hoangprovn-e7567.firebasestorage.app",
      messagingSenderId: "305869803624",
      appId: "1:305869803624:web:6d40aa55277748a8032bdd"
    };

    // Khởi tạo Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // Xử lý đăng nhập
    function login() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          document.getElementById('login-form').classList.add('hidden');
          document.getElementById('logout-section').classList.remove('hidden');
          document.getElementById('update-section').classList.remove('hidden');
          document.getElementById('performance-update-section').classList.remove('hidden');
          alert('Đăng nhập thành công!');
        })
        .catch(error => {
          console.error('Lỗi đăng nhập:', error);
          alert('Đăng nhập thất bại: ' + error.message);
        });
    }

    // Xử lý đăng xuất
    function logout() {
      firebase.auth().signOut()
        .then(() => {
          document.getElementById('login-form').classList.remove('hidden');
          document.getElementById('logout-section').classList.add('hidden');
          document.getElementById('update-section').classList.add('hidden');
          document.getElementById('performance-update-section').classList.add('hidden');
          alert('Đăng xuất thành công!');
        })
        .catch(error => {
          console.error('Lỗi đăng xuất:', error);
          alert('Đăng xuất thất bại: ' + error.message);
        });
    }

    // Kiểm tra trạng thái đăng nhập
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('logout-section').classList.remove('hidden');
        document.getElementById('update-section').classList.remove('hidden');
        document.getElementById('performance-update-section').classList.remove('hidden');
      } else {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('logout-section').classList.add('hidden');
        document.getElementById('update-section').classList.add('hidden');
        document.getElementById('performance-update-section').classList.add('hidden');
      }
    });

    // Tải dữ liệu từ Firebase khi mở trang
    document.addEventListener('DOMContentLoaded', function () {
      // Tải số liệu chính
      database.ref('stats').once('value', (snapshot) => {
        const data = snapshot.val() || {
          netProfit: '45%',
          avgMonthlyProfit: '10%',
          maxDrawdown: '3,92%'
        };
        document.getElementById('net-profit').textContent = data.netProfit;
        document.getElementById('avg-monthly-profit').textContent = data.avgMonthlyProfit;
        document.getElementById('max-drawdown').textContent = data.maxDrawdown;
      });

      // Tải dữ liệu hiệu suất
      database.ref('performance').once('value', (snapshot) => {
        const performanceData = snapshot.val() || {
          month1: 0, month2: 0, month3: 0, month4: 0, month5: 0,
          month6: 0, month7: 0, month8: 0, month9: 0, month10: 0,
          month11: 0, month12: 0
        };
        // Cập nhật biểu đồ
        updateChart(performanceData);
        // Cập nhật giá trị vào input
        for (let i = 1; i <= 12; i++) {
          document.getElementById(`month-${i}`).value = performanceData[`month${i}`] || '';
        }
      });
    });

    // Cập nhật số liệu chính lên Firebase
    function updateData() {
      if (confirm('Bạn có chắc chắn muốn cập nhật số liệu không?')) {
        const newData = {
          netProfit: document.getElementById('input-net-profit').value || document.getElementById('net-profit').textContent,
          avgMonthlyProfit: document.getElementById('input-avg-monthly-profit').value || document.getElementById('avg-monthly-profit').textContent,
          maxDrawdown: document.getElementById('input-max-drawdown').value || document.getElementById('max-drawdown').textContent
        };

        database.ref('stats').set(newData, (error) => {
          if (error) {
            console.error('Lỗi khi cập nhật:', error);
            alert('Cập nhật thất bại: ' + error.message);
          } else {
            document.getElementById('net-profit').textContent = newData.netProfit;
            document.getElementById('avg-monthly-profit').textContent = newData.avgMonthlyProfit;
            document.getElementById('max-drawdown').textContent = newData.maxDrawdown;
            alert('Cập nhật thành công!');
          }
        });
      }
    }

    // Cập nhật dữ liệu hiệu suất lên Firebase
    function updatePerformance() {
      if (confirm('Bạn có chắc chắn muốn cập nhật hiệu suất không?')) {
        const performanceData = {};
        for (let i = 1; i <= 12; i++) {
          const value = document.getElementById(`month-${i}`).value;
          performanceData[`month${i}`] = value ? parseFloat(value) : 0;
        }

        database.ref('performance').set(performanceData, (error) => {
          if (error) {
            console.error('Lỗi khi cập nhật hiệu suất:', error);
            alert('Cập nhật thất bại: ' + error.message);
          } else {
            updateChart(performanceData);
            alert('Cập nhật hiệu suất thành công!');
          }
        });
      }
    }

    // Cập nhật biểu đồ
    let chartInstance = null;
    function updateChart(data) {
      const ctx = document.getElementById('performance-chart').getContext('2d');
      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
          datasets: [{
            label: 'Lợi nhuận (%)',
            data: [
              data.month1, data.month2, data.month3, data.month4, data.month5,
              data.month6, data.month7, data.month8, data.month9, data.month10,
              data.month11, data.month12
            ],
            backgroundColor: 'rgba(34, 211, 238, 0.7)',
                        borderColor: 'rgba(34, 211, 238, 1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(34, 211, 238, 0.9)',
                        hoverBorderColor: 'rgba(34, 211, 238, 1)'
                    }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleFont: { family: 'Quicksand', size: 14 },
                    bodyFont: { family: 'Quicksand', size: 12 },
                    callbacks: {
                        label: function(context) {
                            return `Lợi nhuận: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#d1d5db',
                        font: { family: 'Quicksand', size: 12 }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 20,
                    ticks: {
                        color: '#d1d5db',
                        font: { family: 'Quicksand', size: 12 },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
      });
    }
