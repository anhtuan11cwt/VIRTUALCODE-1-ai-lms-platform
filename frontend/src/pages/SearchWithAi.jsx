import { Mic, Search, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import Card from "../components/Card";
import api from "../services/api";

const SearchWithAi = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setQuery(transcript);
        setListening(false);
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt không hỗ trợ nhận dạng giọng nói");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const { data } = await api.post("/ai/search", { query: query.trim() });
      setResults(data.recommendations || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-bold text-3xl text-gray-900">
            Tìm kiếm thông minh với AI
          </h1>
          <p className="mt-2 text-gray-500">
            Hãy mô tả nhu cầu học tập của bạn hoặc sử dụng giọng nói
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3.5 pr-11 text-sm shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="VD: Tôi muốn học lập trình web..."
                type="text"
                value={query}
              />
              {query && (
                <button
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              className={`flex shrink-0 cursor-pointer items-center justify-center rounded-xl p-3.5 transition ${
                listening
                  ? "animate-pulse bg-red-500 text-white"
                  : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={toggleMic}
              title={listening ? "Đang nghe..." : "Tìm bằng giọng nói"}
              type="button"
            >
              <Mic size={20} />
            </button>
            <button
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-sm text-white transition hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || !query.trim()}
              onClick={handleSearch}
              type="button"
            >
              {loading ? (
                <ClipLoader color="#fff" size={18} />
              ) : (
                <Search size={18} />
              )}
              Tìm kiếm
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-12 text-center">
            <ClipLoader color="#2563eb" size={32} />
            <p className="mt-3 text-gray-500 text-sm">
              AI đang phân tích nhu cầu của bạn...
            </p>
          </div>
        )}

        {results.length > 0 && !loading && (
          <div className="mt-12">
            <div className="mb-6 flex items-center gap-2">
              <Sparkles className="text-purple-600" size={20} />
              <h2 className="font-bold text-gray-900 text-xl">Gợi ý từ AI</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((item) => (
                <div key={item._id}>
                  <Card course={item} />
                  {item.reason && (
                    <p className="mt-2 rounded-lg bg-purple-50 px-3 py-2 text-purple-700 text-xs">
                      <Sparkles
                        className="mr-1 inline text-purple-500"
                        size={12}
                      />
                      {item.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="mt-12 text-center">
            <p className="text-gray-400">
              Không tìm thấy khóa học phù hợp. Thử mô tả khác nhé!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchWithAi;
