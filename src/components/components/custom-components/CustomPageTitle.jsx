import { Card, CardDescription } from "@/components/ui/card";

const CustomPageTitle = ({ title, description }) => {
  return (
    <Card
      className="w-full p-4 mb-3 shadow-md rounded-lg text-white"
      style={{
        background:
          "linear-gradient(280deg, hsla(48, 80%, 66%, 1) 0%, hsla(0, 100%, 25%, 1) 100%)",
      }}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold leading-tight">{title}</h2>
        {description && (
          <CardDescription>
            <p className="text-gray-300 dark:text-gray-400 text-xs">{description}</p>
          </CardDescription>
        )}
      </div>
    </Card>
  );
};

export default CustomPageTitle;
