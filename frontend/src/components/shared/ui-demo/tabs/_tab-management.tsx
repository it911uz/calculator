import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersTableOfManagement from "../management-tables/_users-table";
import RolesTableOfManagement from "../management-tables/_roles-tables";

export function TabsManagement() {
	return (
		<Tabs defaultValue="Таблица пользователей">
			<TabsList>
				<TabsTrigger value="Таблица пользователей">
					Таблица пользователей
				</TabsTrigger>
				<TabsTrigger value="Управление ролями">Управление ролями</TabsTrigger>
			</TabsList>
			<TabsContent value="Таблица пользователей">
				<Card>
					<UsersTableOfManagement />
				</Card>
			</TabsContent>
			<TabsContent value="Управление ролями">
				<Card>
					<RolesTableOfManagement />
				</Card>
			</TabsContent>
		</Tabs>
	);
}
