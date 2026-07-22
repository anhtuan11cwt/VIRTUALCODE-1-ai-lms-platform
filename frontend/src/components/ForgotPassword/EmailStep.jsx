import { Mail, MailCheck } from "lucide-react";

const EmailStep = ({ email, setEmail, error, loading, onSubmit }) => {
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-7 w-7 text-blue-600" />
        </div>
        <h2 className="font-bold text-2xl text-gray-900">Quên mật khẩu</h2>
        <p className="mt-1 text-gray-500 text-sm">
          Nhập địa chỉ email và chúng tôi sẽ gửi mã OTP đặt lại mật khẩu.
        </p>
      </div>

      <form className="space-y-4" noValidate onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <label
            className="block font-medium text-gray-700 text-sm"
            htmlFor="email"
          >
            Địa chỉ Email
          </label>
          <input
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-400" : "border-gray-300"
            } ${loading ? "opacity-50" : ""}`}
            disabled={loading}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@vi-du.com"
            type="email"
            value={email}
          />
          {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
        </div>

        <button
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-sm text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <>
              <MailCheck className="h-4 w-4 animate-pulse" />
              Đang gửi...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Gửi OTP
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EmailStep;
