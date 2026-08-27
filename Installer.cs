using System;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Windows.Forms;
using System.Diagnostics;

namespace ManhNghiaWindowInstaller
{
    public class InstallerForm : Form
    {
        private TextBox txtPath;
        private Button btnBrowse;
        private Button btnInstall;
        private ProgressBar progressBar;
        private Label lblStatus;
        private CheckBox chkRunAfter;

        public InstallerForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "Cài đặt Mạnh Nghĩa Window 2";
            this.Size = new Size(500, 320);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.Font = new Font("Segoe UI", 9.5F, FontStyle.Regular);

            // Banner Panel
            Panel banner = new Panel()
            {
                Size = new Size(500, 65),
                Location = new Point(0, 0),
                BackColor = Color.FromArgb(30, 58, 138) // dark blue
            };
            Label lblBanner = new Label()
            {
                Text = "CÀI ĐẶT MẠNH NGHĨA WINDOW 2",
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 12F, FontStyle.Bold),
                Location = new Point(15, 12),
                AutoSize = true
            };
            Label lblSubBanner = new Label()
            {
                Text = "Phần mềm quản lý xưởng nhôm kính chuyên nghiệp",
                ForeColor = Color.FromArgb(226, 232, 240),
                Font = new Font("Segoe UI", 8.5F, FontStyle.Italic),
                Location = new Point(16, 35),
                AutoSize = true
            };
            banner.Controls.Add(lblBanner);
            banner.Controls.Add(lblSubBanner);
            this.Controls.Add(banner);

            // Path Selection Label
            Label lblPath = new Label()
            {
                Text = "Thư mục cài đặt phần mềm:",
                Location = new Point(20, 85),
                Size = new Size(400, 20)
            };
            this.Controls.Add(lblPath);

            // Textbox for path
            string defaultPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "ManhNghiaWindow");
            txtPath = new TextBox()
            {
                Text = defaultPath,
                Location = new Point(20, 110),
                Size = new Size(350, 25),
                ReadOnly = true
            };
            this.Controls.Add(txtPath);

            // Browse button
            btnBrowse = new Button()
            {
                Text = "Thay đổi...",
                Location = new Point(380, 108),
                Size = new Size(90, 27)
            };
            btnBrowse.Click += BtnBrowse_Click;
            this.Controls.Add(btnBrowse);

            // Checkbox run after
            chkRunAfter = new CheckBox()
            {
                Text = "Mở ứng dụng ngay sau khi cài đặt thành công",
                Location = new Point(20, 150),
                Size = new Size(350, 20),
                Checked = true
            };
            this.Controls.Add(chkRunAfter);

            // Progress bar
            progressBar = new ProgressBar()
            {
                Location = new Point(20, 185),
                Size = new Size(450, 18),
                Visible = false
            };
            this.Controls.Add(progressBar);

            // Status label
            lblStatus = new Label()
            {
                Text = "Sẵn sàng cài đặt...",
                Location = new Point(20, 210),
                Size = new Size(450, 20),
                Font = new Font("Segoe UI", 9F, FontStyle.Italic),
                ForeColor = Color.Gray
            };
            this.Controls.Add(lblStatus);

            // Install button
            btnInstall = new Button()
            {
                Text = "Cài đặt",
                Location = new Point(380, 235),
                Size = new Size(90, 32),
                BackColor = Color.FromArgb(30, 58, 138),
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 9.5F, FontStyle.Bold)
            };
            btnInstall.Click += BtnInstall_Click;
            this.Controls.Add(btnInstall);
        }

        private void BtnBrowse_Click(object sender, EventArgs e)
        {
            using (FolderBrowserDialog fbd = new FolderBrowserDialog())
            {
                fbd.Description = "Chọn thư mục cài đặt Mạnh Nghĩa Window 2";
                fbd.SelectedPath = txtPath.Text;
                if (fbd.ShowDialog() == DialogResult.OK)
                {
                    txtPath.Text = fbd.SelectedPath;
                }
            }
        }

        private void BtnInstall_Click(object sender, EventArgs e)
        {
            btnInstall.Enabled = false;
            btnBrowse.Enabled = false;
            txtPath.Enabled = false;
            progressBar.Visible = true;
            progressBar.Value = 10;

            lblStatus.Text = "Đang chuẩn bị thư mục cài đặt...";
            string targetDir = txtPath.Text;

            try
            {
                if (!Directory.Exists(targetDir))
                {
                    Directory.CreateDirectory(targetDir);
                }
                
                string appDir = Path.Combine(targetDir, "app");
                if (!Directory.Exists(appDir))
                {
                    Directory.CreateDirectory(appDir);
                }

                progressBar.Value = 30;
                lblStatus.Text = "Đang giải nén tài nguyên phần mềm...";
                Application.DoEvents();

                Assembly assembly = Assembly.GetExecutingAssembly();

                // Extract XuongCoKhi.exe (Launcher)
                ExtractResource(assembly, "XuongCoKhi.exe", Path.Combine(targetDir, "XuongCoKhi.exe"));
                progressBar.Value = 60;
                Application.DoEvents();

                // Extract JAR
                ExtractResource(assembly, "windown-be-0.0.1-SNAPSHOT.jar", Path.Combine(appDir, "windown-be-0.0.1-SNAPSHOT.jar"));
                progressBar.Value = 80;
                lblStatus.Text = "Đang tạo phím tắt (Shortcut) ngoài Desktop...";
                Application.DoEvents();

                // Create Shortcut on Desktop
                CreateDesktopShortcut(Path.Combine(targetDir, "XuongCoKhi.exe"));

                progressBar.Value = 100;
                lblStatus.Text = "Cài đặt thành công!";
                Application.DoEvents();

                MessageBox.Show("Phần mềm Quản lý Mạnh Nghĩa Window 2 đã được cài đặt thành công!", "Cài đặt hoàn tất", MessageBoxButtons.OK, MessageBoxIcon.Information);

                if (chkRunAfter.Checked)
                {
                    Process.Start(new ProcessStartInfo()
                    {
                        FileName = Path.Combine(targetDir, "XuongCoKhi.exe"),
                        WorkingDirectory = targetDir
                    });
                }

                this.Close();
            }
            catch (Exception ex)
            {
                progressBar.Value = 0;
                btnInstall.Enabled = true;
                btnBrowse.Enabled = true;
                txtPath.Enabled = true;
                lblStatus.Text = "Lỗi cài đặt!";
                MessageBox.Show("Có lỗi xảy ra trong quá trình cài đặt:\n" + ex.Message, "Lỗi cài đặt", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void ExtractResource(Assembly assembly, string resourceName, string outputPath)
        {
            using (Stream stream = assembly.GetManifestResourceStream(resourceName))
            {
                if (stream == null)
                {
                    throw new Exception("Không tìm thấy tài nguyên nhúng: " + resourceName);
                }
                using (FileStream fileStream = new FileStream(outputPath, FileMode.Create))
                {
                    stream.CopyTo(fileStream);
                }
            }
        }

        private void CreateDesktopShortcut(string exePath)
        {
            try
            {
                string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string shortcutPath = Path.Combine(desktopPath, "Xưởng Cơ Khí.lnk");

                string script = "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('" + shortcutPath.Replace("'", "''") + "'); $Shortcut.TargetPath = '" + exePath.Replace("'", "''") + "'; $Shortcut.WorkingDirectory = '" + Path.GetDirectoryName(exePath).Replace("'", "''") + "'; $Shortcut.Save();";
                
                ProcessStartInfo startInfo = new ProcessStartInfo()
                {
                    FileName = "powershell",
                    Arguments = "-NoProfile -ExecutionPolicy Bypass -Command \"" + script + "\"",
                    CreateNoWindow = true,
                    UseShellExecute = false
                };
                
                using (Process process = Process.Start(startInfo))
                {
                    process.WaitForExit();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Shortcut creation failed: " + ex.Message);
            }
        }

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new InstallerForm());
        }
    }
}
