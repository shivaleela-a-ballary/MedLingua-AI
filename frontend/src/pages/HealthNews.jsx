import { useState } from 'react';

function HealthNews() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const healthNews = [
    {id:1, category:'General Health', title:'Understanding Preventive Healthcare', description:'Regular health checkups can detect problems early.', image:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400', link:'https://www.who.int/health-topics/primary-health-care'},
    {id:2, category:'Nutrition', title:'Balanced Diet for Better Health', description:'Learn about nutrition and proper diet.', image:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', link:'https://www.nutrition.gov'},
    {id:3, category:'Mental Health', title:'Managing Stress and Anxiety', description:'Effective stress management techniques.', image:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', link:'https://www.mentalhealth.gov'},
    {id:4, category:'Exercise', title:'Benefits of Regular Exercise', description:'30 minutes daily exercise transforms health.', image:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', link:'https://www.heart.org/en/healthy-living/fitness'}
  ];

  const schemes = [
    {id:1, name:'Ayushman Bharat', description:'Free health insurance up to ₹5 lakh', link:'https://pmjay.gov.in', icon:'🏥'},
    {id:2, name:'PM Suraksha Bima Yojana', description:'Accident insurance at affordable premium', link:'https://www.india.gov.in', icon:'🛡️'},
    {id:3, name:'National Health Mission', description:'Quality health care to rural population', link:'https://nhm.gov.in', icon:'🏛️'},
    {id:4, name:'Janani Suraksha Yojana', description:'Safe motherhood intervention', link:'https://nhm.gov.in', icon:'👶'}
  ];

  const videos = [
    {id:1, title:'Yoga for Beginners', youtubeId:'v7AYKMP6rOE', description:'Basic yoga poses'},
    {id:2, title:'Healthy Eating Tips', youtubeId:'89OP78l5iFQ', description:'Simple diet tips'},
    {id:3, title:'Mental Health Awareness', youtubeId:'W_ZJRrQWg3c', description:'Understanding mental health'}
  ];

  const categories = ['all', 'General Health', 'Nutrition', 'Mental Health', 'Exercise'];
  const filteredNews = selectedCategory === 'all' ? healthNews : healthNews.filter(n => n.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">Health News & Resources</h1>
        <p className="text-gray-600 text-lg">Stay informed about health and government schemes</p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">📰 Latest Health Articles</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map(c=><button key={c} onClick={()=>setSelectedCategory(c)} className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory===c?'bg-gradient-primary text-white shadow-md':'bg-white border-2 border-gray-200'}`}>{c.charAt(0).toUpperCase()+c.slice(1)}</button>)}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {filteredNews.map(n=><div key={n.id} className="card hover:scale-105 transition-transform"><img src={n.image} alt={n.title} className="w-full h-48 object-cover rounded-lg mb-4"/><span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full mb-3">{n.category}</span><h3 className="text-xl font-bold mb-2">{n.title}</h3><p className="text-gray-600 mb-4">{n.description}</p><a href={n.link} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold hover:text-primary-700">Read More →</a></div>)}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">🏛️ Government Health Schemes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schemes.map(s=><div key={s.id} className="card"><div className="text-4xl mb-4">{s.icon}</div><h3 className="text-lg font-bold mb-3">{s.name}</h3><p className="text-gray-600 text-sm mb-4">{s.description}</p><a href={s.link} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold text-sm">Learn More →</a></div>)}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">🎥 Health & Wellness Videos</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {videos.map(v=><div key={v.id} className="card"><div className="aspect-video mb-4 rounded-lg overflow-hidden"><iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${v.youtubeId}`} title={v.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-lg"></iframe></div><h3 className="text-lg font-bold mb-2">{v.title}</h3><p className="text-gray-600 text-sm">{v.description}</p></div>)}
        </div>
      </section>
    </div>
  );
}

export default HealthNews;
