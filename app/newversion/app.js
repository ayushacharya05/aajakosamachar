// Localize core native React framework variables
const e = React.createElement;
const useState = React.useState;
const useEffect = React.useEffect;

const FEEDS = [
  { name: "OnlineKhabar", url: "https://www.onlinekhabar.com/feed" },
  { name: "Setopati", url: "https://setopati.com/feed" },
  { name: "Ratopati", url: "https://www.ratopati.com/feed" },
  { name: "Kantipur", url: "https://ekantipur.com/rss/news" },
  { name: "TechPana", url: "https://www.techpana.com/feed" },
  { name: "BBC Nepali", url: "https://www.bbc.co.uk/nepali/index.xml" },
  { name: "Our Biratnagar", url: "https://ourbiratnagar.net/feed" },
  { name: "Nepal Press", url: "https://www.nepalpress.com/feed" },
  { name: "Himal Khabar", url: "https://www.himalkhabar.com/rss" },
  { name: "Nepal News", url: "https://nepalnews.com/rss" },
  { name: "Image Khabar", url: "https://www.imagekhabar.com/feed" },
  { name: "Annapurna Post", url: "https://annapurnapost.com/rss" },
  { name: "DC Nepal", url: "https://www.dcnepal.com/feed" },
  { name: "Nepal Khabar", url: "https://nepalkhabar.com/rss" },
  { name: "ICT frame", url: "https://np.ictframe.com/rss" },
  { name: "Technology Khabar", url: "https://www.technologykhabar.com/rss" },
  { name: "News filmy", url: "https://newsfilmy.com/rss" },
  { name: "Nepali Paisa", url: "https://nepalipaisa.com/rss" },
  { name: "Ramailo Cha", url: "https://www.ramailo6.com/rss" },
  { name: "Bizmandu", url: "https://bizmandu.com/rss" },
  { name: "Routine Of Nepal Banda", url: "https://www.ronbpost.com/rss" },
  { name: "Baahrakhari", url: "https://baahrakhari.com/feed" },
];

function cleanSourceName(name) {
  if (!name) return 'समाचार';
  const n = name.toLowerCase();
  if (n.includes('onlinekhabar')) return 'अनलाइनखबर';
  if (n.includes('setopati')) return 'सेतोपाटी';
  if (n.includes('ratopati')) return 'रातोपाटी';
  if (n.includes('nepalkhabar')) return 'नेपालखबर';
  if (n.includes('ourbiratnagar') || n.includes('biratnagar')) return 'हाम्रो विराटनगर';
  if (n.includes('kantipur')) return 'कान्तिपुर';
  var parts = name.split(' ');
  return parts.length > 1 ? parts[0] + ' ' + parts[1] : parts[0];
}

function getTopic(title) {
  if (/खेल|क्रिकेट|फुटबल/i.test(title)) return 'Sports';
  if (/राजनीति|नेता|सरकार/i.test(title)) return 'Politics';
  if (/प्रविधि|मोबाइल|इन्टरनेट/i.test(title)) return 'Tech';
  if (/फिल्म|मनोरञ्जन|कलाकार/i.test(title)) return 'Entertainment';
  if (/बैंक|अर्थ|बजार|शेयर/i.test(title)) return 'Economy';
  return 'General';
}

function getImageUrl(item) {
  if (!item) return null;
  if (item.thumbnail) return item.thumbnail;
  if (item.enclosure && item.enclosure.link) return item.enclosure.link;
  if (item.description) {
    var match = item.description.match(/<img[^>]+src="([^">]+)"/);
    if (match && match[1]) return match[1];
  }
  return null;
}

// Master Dashboard App Component Logic
function App() {
  const [allNews, setAllNews] = useState([]);
  const [displayedNews, setDisplayedNews] = useState([]);
  const [savedNews, setSavedNews] = useState(function() {
    return JSON.parse(localStorage.getItem('savedNews') || '[]');
  });
  const [currentView, setCurrentView] = useState('home');
  const [selectedNews, setSelectedNews] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(!sessionStorage.getItem('hasSeenSplash'));
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(function() {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(function() {
    if (showSplash) {
      const t = setTimeout(function() {
        setShowSplash(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
        fetchNews();
      }, 1500);
      return function() { clearTimeout(t); };
    } else {
      fetchNews();
    }
  }, [showSplash]);

  const fetchNews = async function() {
    setLoading(true);
    try {
      const results = await Promise.all(
        FEEDS.map(function(f) {
          return fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(f.url))
            .then(function(r) { return r.json(); })
            .catch(function() { return { items: [] }; });
        })
      );
      const items = results.flatMap(function(data) {
        return (data.items || []).map(function(item) {
          return Object.assign({}, item, {
            sourceName: cleanSourceName(data.feed ? (data.feed.title || data.feed.name) : ''),
            topic: getTopic(item.title)
          });
        });
      });
      items.sort(function(a, b) { return new Date(b.pubDate) - new Date(a.pubDate); });
      setAllNews(items);
      setDisplayedNews(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveNews = function(item) {
    var isSaved = savedNews.some(function(n) { return n.link === item.link; });
    var updated = isSaved 
      ? savedNews.filter(function(n) { return n.link !== item.link; }) 
      : savedNews.concat([item]);
    setSavedNews(updated);
    localStorage.setItem('savedNews', JSON.stringify(updated));
  };

  const carouselItems = displayedNews.filter(function(n) { return getImageUrl(n); }).slice(0, 5);
  const remainingNews = displayedNews.slice(carouselItems.length > 0 ? 5 : 0);

  useEffect(function() {
    if (carouselItems.length === 0) return;
    const interval = setInterval(function() {
      setCarouselIndex(function(prev) { return (prev + 1) % carouselItems.length; });
    }, 4000);
    return function() { clearInterval(interval); };
  }, [carouselItems.length]);

  if (showSplash) {
    return e('div', { id: 'splashScreen' }, 
      e('img', { src: 'https://raw.githubusercontent.com/ayushacharya05/aajakosamachar/main/images/icon.png', alt: 'Logo' })
    );
  }

  return e('div', null,
    // Header
    e('header', { className: 'app-header' },
      e('div', { onClick: function() { setIsSidebarOpen(true); }, style: { cursor: 'pointer' } }, e('i', { className: 'fas fa-bars-staggered fa-lg' })),
      e('h1', { className: 'brand-name' }, 'आजको समाचार'),
      e('div', { onClick: function() { setDarkMode(!darkMode); }, style: { cursor: 'pointer' } }, e('i', { className: 'fas ' + (darkMode ? 'fa-sun' : 'fa-moon') + ' fa-lg' }))
    ),

    // Sidebar
    e('div', null,
      isSidebarOpen && e('div', { className: 'offcanvas-backdrop fade show', onClick: function() { setIsSidebarOpen(false); } }),
      e('div', { className: 'offcanvas offcanvas-start ' + (isSidebarOpen ? 'show' : ''), style: { visibility: isSidebarOpen ? 'visible' : 'hidden' } },
        e('div', { className: 'offcanvas-header' },
          e('h5', { className: 'brand-name' }, 'मेनु'),
          e('button', { type: 'button', className: 'btn-close', onClick: function() { setIsSidebarOpen(false); } })
        ),
        e('div', { className: 'offcanvas-body p-0' },
          e('a', { href: 'https://aajakosamachar.ayushacharya5.com.np/app/about.html', className: 'nav-link-custom mx-3' }, e('i', { className: 'fas fa-info-circle' }), ' हाम्रो बारेमा'),
          e('a', { href: 'https://aajakosamachar.ayushacharya5.com.np/app/support.html', className: 'nav-link-custom mx-3' }, e('i', { className: 'fas fa-headset' }), ' सहयोग')
        )
      )
    ),

    // Content Display Node Router
    e('main', { className: 'container-fluid p-0' },
      loading ? e('div', { className: 'text-center p-5' }, e('div', { className: 'spinner-border text-primary' })) : e('div', null,
        
        // Category Layout Screen
        currentView === 'categories' && e('div', { id: 'categorySection' },
          [
            { id: 'All', label: 'सबै', icon: 'fas fa-th-large' },
            { id: 'Politics', label: 'राजनीति', icon: 'fas fa-landmark' },
            { id: 'Sports', label: 'खेलकुद', icon: 'fas fa-trophy' },
            { id: 'Tech', label: 'प्रविधि', icon: 'fas fa-microchip' },
            { id: 'Entertainment', label: 'मनोरञ्जन', icon: 'fas fa-film' },
            { id: 'Economy', label: 'अर्थतन्त्र', icon: 'fas fa-chart-line' }
          ].map(function(c) {
            return e('div', { key: c.id, className: 'cat-tile', onClick: function() { setDisplayedNews(c.id === 'All' ? allNews : allNews.filter(function(n) { return n.topic === c.id; })); setCurrentView('home'); } },
              e('i', { className: c.icon + ' mb-2 text-primary fs-2' }), e('br'), e('span', null, c.label)
            );
          })
        ),

        // Live / Taja Stream Screen
        currentView === 'taja' && e('div', { className: 'container pt-3' },
          allNews.slice(0, 40).map(function(item, i) {
            return e('div', { key: i, className: 'taja-card', onClick: function() { setSelectedNews(item); } },
              e('div', { className: 'taja-source' }, item.sourceName),
              e('div', { className: 'taja-title' }, item.title)
            );
          })
        ),

        // Storage Bookmarks Archive Screen
        currentView === 'saved' && e('div', { className: 'container pt-3' },
          savedNews.length === 0 ? e('div', { className: 'text-center p-5 opacity-50' }, 'कुनै समाचार सेभ गरिएको छैन।') :
          savedNews.map(function(item, i) {
            var img = getImageUrl(item);
            return e('div', { key: i, className: 'news-card border-0 shadow-sm mb-3 rounded-4 overflow-hidden', style: { cursor: 'pointer' }, onClick: function() { setSelectedNews(item); } },
              img && e('img', { src: img, className: 'w-100', style: { height: '200px', objectFit: 'cover' } }),
              e('div', { className: 'p-3' }, e('span', { className: 'badge bg-primary mb-2' }, item.sourceName), e('div', { className: 'fw-bold', style: { fontFamily: "'Mukta'", fontSize: '1.15rem' } }, item.title))
            );
          })
        ),

        // Default Home Grid Dashboard Screen
        currentView === 'home' && e('div', null,
          carouselItems.length > 0 && e('div', { id: 'newsCarousel', className: 'carousel slide' },
            e('div', { className: 'carousel-inner' },
              carouselItems.map(function(item, idx) {
                return e('div', { key: idx, className: 'carousel-item ' + (idx === carouselIndex ? 'active' : ''), onClick: function() { setSelectedNews(item); } },
                  e('img', { src: getImageUrl(item) }),
                  e('div', { className: 'carousel-caption' }, e('h5', null, item.title))
                );
              })
            )
          ),
          e('div', { className: 'container pt-2' },
            remainingNews.map(function(item, i) {
              var img = getImageUrl(item);
              return e('div', { key: i, className: 'news-card border-0 shadow-sm mb-3 rounded-4 overflow-hidden', style: { cursor: 'pointer' }, onClick: function() { setSelectedNews(item); } },
                img && e('img', { src: img, className: 'w-100', style: { height: '200px', objectFit: 'cover' } }),
                e('div', { className: 'p-3' }, e('span', { className: 'badge bg-primary mb-2' }, item.sourceName), e('div', { className: 'fw-bold', style: { fontFamily: "'Mukta'", fontSize: '1.15rem' } }, item.title))
              );
            })
          )
        )

      )
    ),

    // Expanded Floating Modal Article Reader
    selectedNews && (function() {
      var img = getImageUrl(selectedNews);
      var isSaved = savedNews.some(function(n) { return n.link === selectedNews.link; });
      var temp = document.createElement("div");
      temp.innerHTML = selectedNews.content || selectedNews.description || "";
      var bodyTxt = temp.textContent || temp.innerText || "";

      return e('div', { id: 'newsReader' },
        e('div', { className: 'reader-header' },
          e('button', { className: 'btn border-0 rounded-circle me-2', onClick: function() { setSelectedNews(null); } }, e('i', { className: 'fas fa-arrow-left fs-5' })),
          e('span', { className: 'fw-bold flex-grow-1' }, 'पढ्नुहोस्'),
          e('button', { className: 'btn border-0', onClick: function() { toggleSaveNews(selectedNews); } }, 
            e('i', { className: (isSaved ? 'fas text-primary' : 'far') + ' fa-bookmark fs-4' })
          )
        ),
        e('div', { className: 'reader-content p-3' },
          e('h2', { className: 'fw-bold mb-3', style: { fontFamily: "'Mukta'" } }, selectedNews.title),
          img && e('img', { className: 'w-100 rounded mb-3', src: img }),
          e('div', { style: { fontFamily: "'Mukta'", fontSize: '1.15rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' } }, bodyTxt),
          e('a', { href: selectedNews.link, target: '_blank', rel: 'noreferrer', className: 'btn btn-primary w-100 mt-4 py-3 rounded-pill fw-bold' }, 'पूरा स्रोतमा पढ्नुहोस्')
        )
      );
    })(),

    // Lower Sticky Anchor Menu Dashboard Navigation Bar
    e('nav', { className: 'bottom-nav' },
      [
        { id: 'home', label: 'होम', icon: 'fas fa-house' },
        { id: 'categories', label: 'विधा', icon: 'fas fa-grip-vertical' },
        { id: 'taja', label: 'ताजा', icon: 'fas fa-fire-alt' },
        { id: 'saved', label: 'सेभ', icon: 'fas fa-bookmark' }
      ].map(function(t) {
        return e('button', { key: t.id, className: 'nav-item ' + (currentView === t.id ? 'active' : ''), onClick: function() { setCurrentView(t.id); } },
          e('i', { className: t.icon }), e('span', null, t.label)
        );
      })
    )
  );
}

// Mount the compiled framework structure onto the browser DOM node mapping layout
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
