export default function RoleBadge({role}){

  const colors={
    Admin:"bg-red-100 text-red-600",
    Editor:"bg-blue-100 text-blue-600",
    Writer:"bg-green-100 text-green-600"
  };

  return(
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[role]}`}>
      {role}
    </span>
  );
}